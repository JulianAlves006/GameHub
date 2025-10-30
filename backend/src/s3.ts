import {
  S3Client,
  DeleteObjectCommand,
  PutObjectCommand,
  GetObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

const REGION = process.env.AWS_REGION!;
const BUCKET = process.env.S3_BUCKET!;
const DEFAULT_EXPIRES = Number(process.env.SIGNED_URL_EXPIRES || 3600); // 1 hora padrão

// Configuração do cliente S3 com credenciais
const s3Config: {
  region: string;
  credentials?: {
    accessKeyId: string;
    secretAccessKey: string;
  };
} = {
  region: REGION,
};

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  s3Config.credentials = {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  };
}

export const s3 = new S3Client(s3Config);

/**
 * Faz upload direto de um buffer para o S3
 */
export async function uploadBuffer(params: {
  key: string;
  buffer: Buffer;
  contentType: string;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: params.key,
    Body: params.buffer,
    ContentType: params.contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });

  await s3.send(command);
  return params.key;
}

export async function presignPut(params: {
  key: string;
  contentType: string;
  expiresIn: number;
}) {
  const command = new PutObjectCommand({
    Bucket: BUCKET,
    Key: params.key,
    ContentType: params.contentType,
    CacheControl: 'public, max-age=31536000, immutable',
  });
  return getSignedUrl(s3, command, { expiresIn: params.expiresIn });
}

export async function presignGet(params: { key: string; expiresIn: number }) {
  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: params.key,
  });
  return getSignedUrl(s3, command, { expiresIn: params.expiresIn });
}

export async function deleteObject(params: { key: string }) {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET,
    Key: params.key,
  });
  return s3.send(command);
}

/**
 * Gera presigned URL para leitura de um objeto no S3
 */
export async function getPresignedUrl(
  key: string,
  expiresIn: number = DEFAULT_EXPIRES
): Promise<string> {
  return presignGet({ key, expiresIn });
}

/**
 * Gera presigned URL para leitura de um objeto no S3 (com prefixo)
 */
export async function getPresignedUrlWithPrefix(
  key: string,
  prefix?: string,
  expiresIn: number = DEFAULT_EXPIRES
): Promise<string> {
  const fullKey = prefix ? `${prefix}${key}` : key;
  return presignGet({ key: fullKey, expiresIn });
}
