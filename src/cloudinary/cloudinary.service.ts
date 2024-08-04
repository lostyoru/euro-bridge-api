// cloudinary.service.ts
import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryResponse } from './cloudinary-response';
import * as streamifier from 'streamifier';

@Injectable()
export class CloudinaryService {
  async uploadFile(file: Express.Multer.File): Promise<CloudinaryResponse> {
    return new Promise<CloudinaryResponse>((resolve, reject) => {
      console.log('file', file);
      const uploadStream = cloudinary.uploader.upload_stream(
        (error, result) => {
          console.log('error', error);
          if (error) return reject(error);
          resolve(result);
        },

      );
      
      const readableStream = streamifier.createReadStream(Buffer.from(file.buffer));
      readableStream.pipe(uploadStream);
    });
  }
}
