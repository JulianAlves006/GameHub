import { presignPut, presignGet, deleteObject } from '../../s3.ts';
import type {
  PresignUploadBody,
  PresignReadQuery,
  DeleteBody,
} from '../../types.js';
import { v4 as uuid } from 'uuid';

const BUCKET = process.env.S3_BUCKET!;
const PREFIX = process.env.S3_PUBLIC_PREFIX || '';
const EXPIRES = Number(process.env.SIGNED_URL_EXPIRES || 300);

function ensureImageMime(mime: string) {
  // ajuste conforme sua regra
  return /^image\/(png|jpe?g|webp|gif|avif)$/.test(mime);
}

export async function createImg(body: PresignUploadBody) {
  const { contentType, extension } = body || {};
  if (!contentType) throw new Error('contentType é obrigatório');
  if (!ensureImageMime(contentType)) throw new Error('MIME inválido');

  const now = new Date();
  const ext = (extension || contentType.split('/')[1] || 'bin').replace(
    /[^a-z0-9]/gi,
    ''
  );
  const key = `${PREFIX}${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, '0')}/${uuid()}.${ext}`;

  const uploadUrl = await presignPut({
    key,
    contentType,
    expiresIn: EXPIRES,
  });
  return { uploadUrl, key, bucket: BUCKET, expiresIn: EXPIRES };
}

export async function getUrl(query: PresignReadQuery) {
  const { key, ttl } = query;
  if (!key) throw new Error('key é obrigatória');

  const expiresIn = Number(ttl || EXPIRES);
  const url = await presignGet({ key, expiresIn });
  return { url, expiresIn };
}

export async function deleteImg(body: DeleteBody) {
  const { key } = body || {};
  if (!key) throw new Error('key é obrigatória');

  await deleteObject({ key });
  return { ok: true };
}
