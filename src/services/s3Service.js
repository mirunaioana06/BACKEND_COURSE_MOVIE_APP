import { DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';

import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

import { s3Client, AWS_BUCKET_NAME } from '../config/s3.js';

const deleteVideoObject = async (videoKey) => {
  if (!videoKey) {
    return;
  }

  const command = new DeleteObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: videoKey,
  });

  await s3Client.send(command);
};

const createVideoViewUrl = async (videoKey, expiresInSeconds = 15 * 60) => {
  const command = new GetObjectCommand({
    Bucket: AWS_BUCKET_NAME,
    Key: videoKey,
    ResponseContentType: 'video/mp4',
    ResponseContentDisposition: 'inline',
  });

  return getSignedUrl(s3Client, command, {
    expiresIn: expiresInSeconds,
  });
};

export { deleteVideoObject, createVideoViewUrl };
