import { Injectable } from "@nestjs/common";

@Injectable()
export class FileService {
  getImageUrl(fileName: string) {
    return `/file/image/originals/${fileName}`;
  }

  getThumbnailUrl(fileName: string) {
    return `/file/image/thumbnails/${fileName}`;
  }
}
