const crypto = require('crypto');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

// Registrants' identity/payment documents. This bucket must be PRIVATE.
const PRIVATE_BUCKET = process.env.SUPABASE_PRIVATE_BUCKET || 'registerations';
// Speaker/reviewer/workshop images shown on the public site.
const PUBLIC_BUCKET = process.env.SUPABASE_PUBLIC_BUCKET || 'public-assets';

const SIGNED_URL_TTL_SECONDS = 300;

async function putObject(bucket, buffer, fileName, folder) {
  // Random object names: unguessable, and no registrant PII in the path.
  const ext = path.extname(fileName).toLowerCase().replace(/[^a-z0-9.]/g, '');
  const objectPath = `${folder}/${crypto.randomUUID()}${ext}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(objectPath, buffer, {
      contentType: getContentType(fileName),
      upsert: false,
    });

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }
  return data.path;
}

/**
 * Upload a registrant document to the private bucket.
 * @returns {Promise<string>} Object path (NOT a URL). Use createSignedUrl() to view it.
 */
async function uploadPrivateFile(buffer, fileName, folder) {
  return putObject(PRIVATE_BUCKET, buffer, fileName, folder);
}

/**
 * Upload a public site image (speakers, reviewers, workshop posters).
 * @returns {Promise<string>} Public URL
 */
async function uploadPublicFile(buffer, fileName, folder) {
  const objectPath = await putObject(PUBLIC_BUCKET, buffer, fileName, folder);
  const { data } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(objectPath);
  return data.publicUrl;
}

/**
 * Normalise a stored document reference to an object path in the private bucket.
 * Accepts a bare path, or a legacy public URL saved before the bucket was made private.
 * Returns null if the value does not point into the private bucket.
 */
function toPrivatePath(value) {
  if (!value || typeof value !== 'string') return null;
  const marker = `/storage/v1/object/public/${PRIVATE_BUCKET}/`;
  let p = value;
  if (/^https?:\/\//i.test(value)) {
    const idx = value.indexOf(marker);
    if (idx === -1) return null;
    p = decodeURIComponent(value.slice(idx + marker.length).split('?')[0]);
  }
  if (p.includes('..') || p.startsWith('/')) return null;
  return p;
}

async function createSignedUrl(objectPath) {
  const { data, error } = await supabase.storage
    .from(PRIVATE_BUCKET)
    .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);
  if (error) throw new Error(`Could not sign file URL: ${error.message}`);
  return data.signedUrl;
}

function getContentType(fileName) {
  const ext = fileName.toLowerCase().split('.').pop();
  const types = {
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    png: 'image/png',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    webp: 'image/webp',
  };
  return types[ext] || 'application/octet-stream';
}

module.exports = {
  supabase,
  PRIVATE_BUCKET,
  PUBLIC_BUCKET,
  uploadPrivateFile,
  uploadPublicFile,
  toPrivatePath,
  createSignedUrl,
};
