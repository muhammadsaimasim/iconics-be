const { body, query, validationResult } = require('express-validator');

// ─── Common helpers ───────────────────────────────────────────────────────────

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map(e => ({ field: e.path, message: e.msg })),
    });
  }
  next();
};

const SHORT = 150;
const LONG = 3000;

const PHONE_RE = /^\+?[0-9][0-9\s()-]{6,19}$/;
const IEEE_RE = /^\d{8}$/;

const text = (field, label, max = SHORT) =>
  body(field).isString().withMessage(`${label} is required`).bail()
    .trim().notEmpty().withMessage(`${label} is required`).bail()
    .isLength({ max }).withMessage(`${label} must be at most ${max} characters`);

const optionalText = (field, label, max = SHORT) =>
  body(field).optional({ values: 'falsy' }).isString().trim()
    .isLength({ max }).withMessage(`${label} must be at most ${max} characters`);

const email = (field, label = 'Valid email') =>
  body(field).isString().trim().isEmail().withMessage(`${label} is required`).bail()
    .isLength({ max: 254 }).normalizeEmail({ gmail_remove_dots: false });

const phone = (field, label) =>
  body(field).isString().trim().matches(PHONE_RE).withMessage(`${label} must be a valid phone number`);

const pastDate = (field, label) =>
  body(field).isISO8601().withMessage(`${label} must be a valid date`).bail()
    .custom(v => {
      const d = new Date(v);
      return d.getFullYear() >= 2025 && d.getTime() <= Date.now() + 24 * 3600 * 1000;
    }).withMessage(`${label} is not a plausible payment date`);

const mustBeTrue = (field, message) =>
  body(field).custom(val => val === true || val === 'true').withMessage(message);

const paymentRules = (prefix = '') => [
  text(`${prefix}stanTransactionId`, 'STAN/Transaction ID', 64),
  pastDate(`${prefix}transactionDate`, 'Transaction date'),
  text(`${prefix}bankDetails`, 'Bank details', 300),
  text(`${prefix}totalAmountPaid`, 'Total amount paid', 50),
];

// ─── Workshop Registration ────────────────────────────────────────────────────

const workshopRules = [
  email('email'),
  text('fullName', 'Full name'),
  phone('mobileNumber', 'Mobile number'),
  text('cnicNumber', 'CNIC number', 20).bail()
    .matches(/^[A-Za-z0-9-]{5,20}$/).withMessage('CNIC number may contain only digits and dashes'),
  text('institutionOrg', 'Institution/Organization', 200),
  text('semesterDesignation', 'Semester/Designation'),
  text('professionalAddress', 'Professional address', 500),
  text('highestDegree', 'Highest degree'),
  text('quantumCourses', 'Quantum computing courses description', LONG),
  text('whyWorkshopHelps', 'Why the workshop will help you', LONG),
  text('travelArrangement', 'Travel arrangement description', LONG),
  body('attendanceCertificate').isBoolean().withMessage('Attendance certificate preference is required'),
  mustBeTrue('termsAgreed', 'You must agree to the terms and conditions'),
];

// ─── Participant Registration ─────────────────────────────────────────────────

const participantRules = [
  body('registrationType')
    .isIn(['professional', 'student'])
    .withMessage('Registration type must be "professional" or "student"'),
  email('email'),
  text('fullName', 'Full name'),
  optionalText('rollNo', 'Roll number', 50),
  body('rollNo').if(body('registrationType').equals('student'))
    .isString().trim().notEmpty().withMessage('Roll number is required for students'),
  text('department', 'Department'),
  text('institute', 'Institute', 200),
  phone('contactNo', 'Contact number'),
  body('ieeeNumber').optional({ values: 'falsy' }).isString().trim()
    .matches(IEEE_RE).withMessage('IEEE number must be exactly 8 digits'),
  ...paymentRules(),
  mustBeTrue('certified', 'You must certify that the information is correct'),
];

// ─── Paper Registration ───────────────────────────────────────────────────────

const MAX_CO_AUTHORS = 10;

// Multipart forms send coAuthors as a JSON string; parse it before validating.
const parseCoAuthors = (req, res, next) => {
  const { hasCoAuthors, coAuthors } = req.body;
  if (hasCoAuthors === true || hasCoAuthors === 'true') {
    if (typeof coAuthors === 'string') {
      try { req.body.coAuthors = JSON.parse(coAuthors); } catch {
        return res.status(400).json({ success: false, message: 'Invalid co-author data' });
      }
    }
  } else {
    req.body.coAuthors = [];
  }
  next();
};

const paperRules = [
  body('registrationType')
    .isIn(['academia_industry', 'student'])
    .withMessage('Registration type must be "academia_industry" or "student"'),
  email('email'),
  text('paperId', 'Paper ID', 50),
  text('paperTitle', 'Paper title', 500),
  text('authorName', 'Author name'),
  optionalText('rollNo', 'Roll number', 50),
  text('department', 'Department'),
  text('institution', 'Institution', 200),
  phone('contactNo', 'Contact number'),
  ...paymentRules(),
  mustBeTrue('certified', 'You must certify that the information is correct'),
  body('coAuthors').isArray({ max: MAX_CO_AUTHORS }).withMessage(`At most ${MAX_CO_AUTHORS} co-authors are allowed`),
  body('coAuthors.*.registrationType')
    .isIn(['academia_industry', 'student'])
    .withMessage('Co-author registration type is required'),
  email('coAuthors.*.email', 'Valid co-author email'),
  text('coAuthors.*.paperId', 'Co-author paper ID', 50),
  text('coAuthors.*.paperTitle', 'Co-author paper title', 500),
  text('coAuthors.*.authorName', 'Co-author name'),
  optionalText('coAuthors.*.rollNo', 'Co-author roll number', 50),
  text('coAuthors.*.department', 'Co-author department'),
  text('coAuthors.*.institution', 'Co-author institution', 200),
  phone('coAuthors.*.contactNo', 'Co-author contact number'),
  ...paymentRules('coAuthors.*.'),
  mustBeTrue('coAuthors.*.certified', 'Co-author must certify information'),
];

// ─── IEEE check ───────────────────────────────────────────────────────────────

const ieeeCheckRules = [
  query('number').isString().trim().matches(IEEE_RE).withMessage('IEEE number must be exactly 8 digits'),
];

module.exports = {
  validate,
  workshopRules,
  participantRules,
  paperRules,
  parseCoAuthors,
  ieeeCheckRules,
};
