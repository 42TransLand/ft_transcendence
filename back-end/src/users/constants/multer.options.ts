import { BadRequestException } from '@nestjs/common';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { existsSync, mkdirSync } from 'fs';
import { diskStorage } from 'multer';

export const loaclOptions: MulterOptions = {
  storage: diskStorage({
    destination: (req, file, cb) => {
      const uploadPath = 'files/profileImg';
      if (!existsSync(uploadPath)) {
        mkdirSync(uploadPath, { recursive: true });
      }
      cb(null, uploadPath);
    },
    filename(req, file, cb) {
      const userId = req['user'].id;
      const fileMimeType = file.mimetype.split('/')[1];
      cb(null, `${userId}.${fileMimeType}`);
    },
  }),
  fileFilter: (req, file, cb) => {
    const fileMimeType = file.mimetype.split('/')[1];
    if (fileMimeType === 'jpg' || fileMimeType === 'jpeg') {
      cb(null, true);
    } else {
      cb(new BadRequestException(`지원하지 않는 형식입니다.`), false);
    }
  },
};
