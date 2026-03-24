const multer = require('multer');

// Store files in memory buffer for Supabase upload
const storage = multer.memoryStorage();

const fileFilter = (_req, file, cb) => {
  const allowed = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'image/png',
    'image/jpeg',
    'image/jpg',
  ];

  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only PDF, DOC, DOCX, PNG, and JPG are allowed.'), false);
  }
};

// Workshop registration: resume upload (max 10MB)
const workshopUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
}).single('resume');

// Participant/paper registration: transaction receipt + student card (max 100MB each)
const registrationUpload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB
}).fields([
  { name: 'transactionReceipt', maxCount: 5 },
  { name: 'studentCard', maxCount: 1 },
]);

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
    next();
  });
};

module.exports = {
  workshopUpload: handleUpload(workshopUpload),
  registrationUpload: handleUpload(registrationUpload),
};
