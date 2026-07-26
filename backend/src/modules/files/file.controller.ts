import {
  BadRequestException,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FileService } from './file.service';

type UploadedImage = {
  buffer: Buffer;
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
      storage: memoryStorage(),

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
  async uploadImage(@UploadedFile() file?: UploadedImage) {
    if (!file) {
      throw new BadRequestException('Image is required');
    }

    return {
      message: 'Image upload is temporarily disabled',
      fileName: file.originalname,
      mimeType: file.mimetype,
      size: file.size,
    };
  }

  @Get('image/:type/:fileName')
  getImage(
    @Param('type') _type: string,
    @Param('fileName') _fileName: string,
  ) {
    throw new NotFoundException(
      'Image storage is temporarily unavailable',
    );
  }
}