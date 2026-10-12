const prisma = require('../../utils/prisma');
const { uploadPrivateFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      registrationType, email, paperId, paperTitle,
      authorName, rollNo, department, institution,
      contactNo, stanTransactionId, transactionDate,
      bankDetails, totalAmountPaid, certified,
    } = req.body;
    // Parsed and validated by parseCoAuthors + paperRules
    const coAuthors = req.body.coAuthors || [];

    // Upload files (stored as private object paths, not public URLs)
    let transactionReceiptPath = null;
    let studentCardPath = null;

    if (req.files?.transactionReceipt?.length) {
      transactionReceiptPath = await uploadPrivateFile(
        req.files.transactionReceipt[0].buffer,
        req.files.transactionReceipt[0].originalname,
        'paper-receipts'
      );
    }

    if (req.files?.studentCard?.length) {
      studentCardPath = await uploadPrivateFile(
        req.files.studentCard[0].buffer,
        req.files.studentCard[0].originalname,
        'paper-student-cards'
      );
    }

    const registration = await prisma.paperRegistration.create({
      data: {
        registrationType,
        email,
        paperId,
        paperTitle,
        authorName,
        rollNo: rollNo || null,
        department,
        institution,
        contactNo,
        stanTransactionId,
        transactionDate: new Date(transactionDate),
        bankDetails,
        totalAmountPaid,
        transactionReceipt: transactionReceiptPath,
        studentCard: studentCardPath,
        certified: certified === true || certified === 'true',
        hasCoAuthors: coAuthors.length > 0,
        coAuthors: {
          create: coAuthors.map(ca => ({
            registrationType: ca.registrationType,
            email: ca.email,
            paperId: ca.paperId,
            paperTitle: ca.paperTitle,
            authorName: ca.authorName,
            rollNo: ca.rollNo || null,
            department: ca.department,
            institution: ca.institution,
            contactNo: ca.contactNo,
            stanTransactionId: ca.stanTransactionId,
            transactionDate: new Date(ca.transactionDate),
            bankDetails: ca.bankDetails,
            totalAmountPaid: ca.totalAmountPaid,
            certified: ca.certified === true || ca.certified === 'true',
          })),
        },
      },
      include: { coAuthors: true },
    });

    res.status(201).json({
      success: true,
      message: 'Paper registration submitted successfully',
      data: { id: registration.id, coAuthorsCount: registration.coAuthors.length },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { register };
