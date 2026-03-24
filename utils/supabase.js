const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_KEY
);

/**
 * Upload a file buffer to Supabase Storage.
 * @param {Buffer} buffer - File buffer from multer
 * @param {string} fileName - Original file name
 * @param {string} bucket - Storage bucket name
 * @param {string} folder - Folder path within the bucket
 * @returns {Promise<string>} Public URL of the uploaded file
 */
async function uploadFile(buffer, fileName, bucket = 'registrations', folder = 'uploads') {
  const timestamp = Date.now();
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const path = `${folder}/${timestamp}_${sanitized}`;

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, buffer, {
      contentType: getContentType(fileName),
      upsert: false,
    });

  if (error) {
    throw new Error(`File upload failed: ${error.message}`);
  }

  const { data: urlData } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path);

  return urlData.publicUrl;
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
  };
  return types[ext] || 'application/octet-stream';
}

module.exports = { supabase, uploadFile };
