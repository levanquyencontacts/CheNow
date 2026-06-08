import {
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import type { Response } from 'express';
import { diskStorage } from 'multer';
import { existsSync } from 'node:fs';
import { mkdir } from 'node:fs/promises';
import { extname, join } from 'path';
import sharp from 'sharp';
import { FileService } from './file.service';

type UploadedImage = {
  filename: string;
  originalname: string;
  mimetype: string;
  size: number;
};

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('image')
  @UseInterceptors(
    FileInterceptor('image', {
      storage: diskStorage({
        destination: join(
          process.cwd(),
          'public',
          'upload',
          'images',
          'originals',
        ),
        filename: (_req, file, callback) => {
          const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extname(file.originalname)}`;
          callback(null, uniqueName);
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
    const originalPath = join(
      process.cwd(),
      'public',
      'upload',
      'images',
      'originals',
      file.filename,
    );
    const thumbnailDir = join(
      process.cwd(),
      'public',
      'upload',
      'images',
      'thumbnails',
    );
    const thumbnailPath = join(thumbnailDir, file.filename);

    await mkdir(thumbnailDir, { recursive: true });
    await sharp(originalPath)
      .resize(300, 300, { fit: 'cover' })
      .png({
        compressionLevel: 9,
      })
      .toFile(thumbnailPath);

    return {
      message: 'successfully uploaded',
      fileName: file.filename,
    };
  }

  @Get('image/:type/:fileName')
  getImage(
    @Param('type') type: string,
    @Param('fileName') fileName: string,
    @Res() response: Response,
  ) {
    const folder = type === 'thumbnails' ? 'thumbnails' : 'originals';
    const imagePath = join(
      process.cwd(),
      'public',
      'upload',
      'images',
      folder,
      fileName,
    );
    if (!existsSync(imagePath)) {
      throw new NotFoundException('Image not found');
    }

    return response.sendFile(imagePath);
  }
}
