const multer = require('multer');
const path = require('path');

// Store files in memory buffer for Supabase upload. Limits below keep the
// worst-case memory per request small (a few MB, not hundreds).
const storage = multer.memoryStorage();

const DOC_EXTENSIONS = ['.pdf', '.doc', '.docx', '.png', '.jpg', '.jpeg'];
const IMAGE_EXTENSIONS = ['.png', '.jpg', '.jpeg', '.webp'];

// File signatures ("magic bytes"). The extension and the client-reported
// mimetype are attacker-controlled, so the content itself is checked too.
const SIGNATURES = {
  '.pdf': [[0x25, 0x50, 0x44, 0x46]],                          // %PDF
  '.png': [[0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]],
  '.jpg': [[0xff, 0xd8, 0xff]],
  '.jpeg': [[0xff, 0xd8, 0xff]],
  '.doc': [[0xd0, 0xcf, 0x11, 0xe0, 0xa1, 0xb1, 0x1a, 0xe1]],   // OLE2
  '.docx': [[0x50, 0x4b, 0x03, 0x04]],                          // ZIP
  '.webp': [[0x52, 0x49, 0x46, 0x46]],                          // RIFF (checked with WEBP below)
};

function matchesSignature(buffer, ext) {
  const sigs = SIGNATURES[ext];
  if (!sigs || !buffer) return false;
  const ok = sigs.some(sig => sig.every((b, i) => buffer[i] === b));
  if (ok && ext === '.webp') return buffer.slice(8, 12).toString('ascii') === 'WEBP';
  return ok;
}

const extensionFilter = (allowed) => (_req, file, cb) => {
  // Mobile pickers often report a generic mimetype, so the extension is the
  // gate here; content is verified after upload by verifyFileContents.
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowed.includes(ext)) {
    cb(null, true);
  } else {
    const list = allowed.map(e => e.slice(1).toUpperCase()).join(', ');
    cb(new Error(`Invalid file type. Only ${list} files are allowed.`), false);
  }
};

const verifyFileContents = (req) => {
  const files = [
    ...(req.file ? [req.file] : []),
    ...Object.values(req.files || {}).flat(),
  ];
  for (const file of files) {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!matchesSignature(file.buffer, ext)) {
      return `"${file.fieldname}" does not look like a valid ${ext.slice(1).toUpperCase()} file.`;
    }
  }
  return null;
};

// Workshop registration: resume upload
const workshopUpload = multer({
  storage,
  fileFilter: extensionFilter(DOC_EXTENSIONS),
  limits: { fileSize: 10 * 1024 * 1024, files: 1, fields: 40, fieldSize: 20 * 1024 },
}).single('resume');

// Participant/paper registration: transaction receipt + student card
const registrationUpload = multer({
  storage,
  fileFilter: extensionFilter(DOC_EXTENSIONS),
  limits: { fileSize: 10 * 1024 * 1024, files: 2, fields: 40, fieldSize: 64 * 1024 },
}).fields([
  { name: 'transactionReceipt', maxCount: 1 },
  { name: 'studentCard', maxCount: 1 },
]);

// Admin image uploads (speaker/reviewer photos, workshop posters)
const imageUpload = (field) => multer({
  storage,
  fileFilter: extensionFilter(IMAGE_EXTENSIONS),
  limits: { fileSize: 5 * 1024 * 1024, files: 1 },
}).single(field);

// Wrap multer middleware to handle errors gracefully
const handleUpload = (uploadMiddleware) => (req, res, next) => {
  uploadMiddleware(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: `Upload error: ${err.message}`,
      });
    }
    if (err) {
      return res.status(400).json({
        success: false,
        message: err.message,
      });
    }
    const contentError = verifyFileContents(req);
    if (contentError) {
      return res.status(400).json({ success: false, message: contentError });
    }
    next();
  });
};

module.exports = {
  workshopUpload: handleUpload(workshopUpload),
  registrationUpload: handleUpload(registrationUpload),
  imageUpload: (field) => handleUpload(imageUpload(field)),
};
