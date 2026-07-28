import 'dotenv/config';
import { S3Client } from '@aws-sdk/client-s3';

const { AWS_REGION, AWS_BUCKET_NAME } = process.env;

if (!AWS_REGION || !AWS_BUCKET_NAME) {
  throw new Error('AWS_REGION and AWS_BUCKET_NAME must be defined');
}

const s3Client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

export { s3Client, AWS_BUCKET_NAME };
