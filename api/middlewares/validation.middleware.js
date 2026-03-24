const { body, validationResult } = require('express-validator');

// ─── Common helper ──────────────────────────────────────────────────────────

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

// ─── Workshop Registration ──────────────────────────────────────────────────

const workshopRules = [
  body('email').isEmail().withMessage('Valid email is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('mobileNumber').trim().notEmpty().withMessage('Mobile number is required'),
  body('cnicNumber').trim().notEmpty().withMessage('CNIC number is required'),
  body('institutionOrg').trim().notEmpty().withMessage('Institution/Organization is required'),
  body('semesterDesignation').trim().notEmpty().withMessage('Semester/Designation is required'),
  body('professionalAddress').trim().notEmpty().withMessage('Professional address is required'),
  body('highestDegree').trim().notEmpty().withMessage('Highest degree is required'),
  body('quantumCourses').trim().notEmpty().withMessage('Quantum computing courses description is required'),
  body('whyWorkshopHelps').trim().notEmpty().withMessage('Please describe why the workshop will help you'),
  body('travelArrangement').trim().notEmpty().withMessage('Travel arrangement description is required'),
  body('attendanceCertificate').isBoolean().withMessage('Attendance certificate preference is required'),
  body('termsAgreed')
    .custom(val => val === true || val === 'true')
    .withMessage('You must agree to the terms and conditions'),
];

// ─── Participant Registration ───────────────────────────────────────────────

const participantRules = [
  body('registrationType')
    .isIn(['professional', 'student'])
    .withMessage('Registration type must be "professional" or "student"'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('fullName').trim().notEmpty().withMessage('Full name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('institute').trim().notEmpty().withMessage('Institute is required'),
  body('contactNo').trim().notEmpty().withMessage('Contact number is required'),
  body('stanTransactionId').trim().notEmpty().withMessage('STAN/Transaction ID is required'),
  body('transactionDate').notEmpty().withMessage('Transaction date is required'),
  body('bankDetails').trim().notEmpty().withMessage('Bank details are required'),
  body('totalAmountPaid').trim().notEmpty().withMessage('Total amount paid is required'),
  body('certified')
    .custom(val => val === true || val === 'true')
    .withMessage('You must certify that the information is correct'),
];

// ─── Paper Registration ─────────────────────────────────────────────────────

const paperRules = [
  body('registrationType')
    .isIn(['academia_industry', 'student'])
    .withMessage('Registration type must be "academia_industry" or "student"'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('paperId').trim().notEmpty().withMessage('Paper ID is required'),
  body('paperTitle').trim().notEmpty().withMessage('Paper title is required'),
  body('authorName').trim().notEmpty().withMessage('Author name is required'),
  body('department').trim().notEmpty().withMessage('Department is required'),
  body('institution').trim().notEmpty().withMessage('Institution is required'),
  body('contactNo').trim().notEmpty().withMessage('Contact number is required'),
  body('stanTransactionId').trim().notEmpty().withMessage('STAN/Transaction ID is required'),
  body('transactionDate').notEmpty().withMessage('Transaction date is required'),
  body('bankDetails').trim().notEmpty().withMessage('Bank details are required'),
  body('totalAmountPaid').trim().notEmpty().withMessage('Total amount paid is required'),
  body('certified')
    .custom(val => val === true || val === 'true')
    .withMessage('You must certify that the information is correct'),
];

// ─── Co-Author Registration ─────────────────────────────────────────────────

const coAuthorRules = [
  body('coAuthors').isArray({ min: 1 }).withMessage('At least one co-author is required'),
  body('coAuthors.*.registrationType')
    .isIn(['academia_industry', 'student'])
    .withMessage('Co-author registration type is required'),
  body('coAuthors.*.email').isEmail().withMessage('Valid co-author email is required'),
  body('coAuthors.*.paperId').trim().notEmpty().withMessage('Co-author paper ID is required'),
  body('coAuthors.*.paperTitle').trim().notEmpty().withMessage('Co-author paper title is required'),
  body('coAuthors.*.authorName').trim().notEmpty().withMessage('Co-author name is required'),
  body('coAuthors.*.department').trim().notEmpty().withMessage('Co-author department is required'),
  body('coAuthors.*.institution').trim().notEmpty().withMessage('Co-author institution is required'),
  body('coAuthors.*.contactNo').trim().notEmpty().withMessage('Co-author contact number is required'),
  body('coAuthors.*.stanTransactionId').trim().notEmpty().withMessage('Co-author transaction ID is required'),
  body('coAuthors.*.transactionDate').notEmpty().withMessage('Co-author transaction date is required'),
  body('coAuthors.*.bankDetails').trim().notEmpty().withMessage('Co-author bank details are required'),
  body('coAuthors.*.totalAmountPaid').trim().notEmpty().withMessage('Co-author amount paid is required'),
  body('coAuthors.*.certified')
    .custom(val => val === true || val === 'true')
    .withMessage('Co-author must certify information'),
];

module.exports = {
  validate,
  workshopRules,
  participantRules,
  paperRules,
  coAuthorRules,
};
