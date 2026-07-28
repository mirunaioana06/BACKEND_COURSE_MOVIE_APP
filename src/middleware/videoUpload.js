import { randomUUID } from 'node:crypto';
import multer from 'multer';
import multerS3 from 'multer-s3';

import { s3Client, AWS_BUCKET_NAME } from '../config/s3.js';

const videoFileFilter = (req, file, callback) => {
  if (file.mimetype !== 'video/mp4') {
    const error = new Error('Only MP4 video files are allowed');
    error.statusCode = 415;

    return callback(error);
  }

  callback(null, true);
};

const uploadVideo = multer({
  storage: multerS3({
    s3: s3Client,
    bucket: AWS_BUCKET_NAME,

    contentType: multerS3.AUTO_CONTENT_TYPE,

    metadata: (req, file, callback) => {
      callback(null, {
        movieId: req.movie.id,
        uploadedBy: req.user.id,
      });
    },

    key: (req, file, callback) => {
      const videoKey = `movies/${req.movie.id}/${randomUUID()}.mp4`;

      callback(null, videoKey);
    },
  }),

  limits: {
    files: 1,
    fileSize: 50 * 1024 * 1024,
  },

  fileFilter: videoFileFilter,
});

export { uploadVideo };
