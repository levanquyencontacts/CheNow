import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { list, put } from '@vercel/blob';
import type { Response } from 'express';
import { diskStorage, memoryStorage } from 'multer';
import { existsSync, mkdirSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { extname, join } from 'path';
import sharp from 'sharp';
import { FileService } from './file.service';
import { JwtAuthGuard } from '../../guards/jwtauth.guath';

type UploadedImage = {
  buffer?: Buffer;
  filename?: string;
  originalname: string;
  mimetype: string;
  size: number;
};

const isVercel = process.env.VERCEL === '1';
const imageRoot = join(process.cwd(), 'public', 'upload', 'images');
const originalsDir = join(imageRoot, 'originals');
const thumbnailsDir = join(imageRoot, 'thumbnails');

if (!isVercel) {
  mkdirSync(originalsDir, { recursive: true });
  mkdirSync(thumbnailsDir, { recursive: true });
}

const createFileName = (originalName: string) =>
  `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(originalName)}`;

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(
    FileInterceptor('image', {
      storage: isVercel
        ? memoryStorage()
        : diskStorage({
            destination: originalsDir,
            filename: (_req, file, callback) => {
              callback(null, createFileName(file.originalname));
            },
          }),
      fileFilter: (_req, file, callback) => {
        if (!file.mimetype.match(/^image\/(jpeg|png|webp|gif)$/)) {
          callback(new Error('Only image files are allowed'), false);
          return;
        }

        callback(null, true);
      },
      limits: {
        fileSize: 5 * 1024 * 1024,
      },
    }),
  )
  async uploadImage(@UploadedFile() file: UploadedImage) {
    const fileName = file.filename ?? createFileName(file.originalname);

    if (isVercel) {
      if (!file.buffer) {
        throw new Error('Uploaded image buffer is missing');
      }

      const thumbnail = await sharp(file.buffer)
        .resize(300, 300, { fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toBuffer();

      await Promise.all([
        put(`originals/${fileName}`, file.buffer, {
          access: 'public',
          addRandomSuffix: false,
          contentType: file.mimetype,
        }),
        put(`thumbnails/${fileName}`, thumbnail, {
          access: 'public',
          addRandomSuffix: false,
          contentType: 'image/png',
        }),
      ]);
    } else {
      const originalPath = join(originalsDir, fileName);
      const thumbnailPath = join(thumbnailsDir, fileName);

      await mkdir(thumbnailsDir, { recursive: true });
      await sharp(originalPath)
        .resize(300, 300, { fit: 'cover' })
        .png({ compressionLevel: 9 })
        .toFile(thumbnailPath);
    }

    return {
      message: 'successfully uploaded',
      fileName,
    };
  }

  @Get('image/:type/:fileName')
  async getImage(
    @Param('type') type: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const folder = type === 'thumbnails' ? 'thumbnails' : 'originals';

    if (isVercel) {
      const pathname = `${folder}/${fileName}`;
      const { blobs } = await list({ prefix: pathname, limit: 1 });
      const image = blobs.find((blob) => blob.pathname === pathname);

      if (!image) {
        throw new NotFoundException('Image not found');
      }

      return response.redirect(image.url);
    }

    const imagePath = join(imageRoot, folder, fileName);
    if (!existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    return response.sendFile(imagePath);
  }
}
