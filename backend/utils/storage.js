import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { randomUUID } from 'node:crypto';
import path from 'path';

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET;

export const uploadToStorage = async (file) => {
  const fileExtension = path.extname(file.originalname);
  const key = `attachments/${randomUUID()}${fileExtension}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: file.buffer,
    ContentType: file.mimetype
  });

  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
};

export const deleteFromStorage = async (fileUrl) => {
  const key = fileUrl.split('/').slice(-2).join('/'); // Get the key from URL (attachments/uuid.ext)
  
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key
  });

  await s3Client.send(command);
}; 