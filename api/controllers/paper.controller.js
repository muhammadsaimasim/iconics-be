const prisma = require('../../utils/prisma');
const { uploadFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      registrationType, email, paperId, paperTitle,
      authorName, rollNo, department, institution,
      contactNo, stanTransactionId, transactionDate,
      bankDetails, totalAmountPaid, certified,
      hasCoAuthors, coAuthors,
    } = req.body;

    // Upload files
    let transactionReceiptUrl = null;
    let studentCardUrl = null;

    if (req.files?.transactionReceipt?.length) {
      transactionReceiptUrl = await uploadFile(
        req.files.transactionReceipt[0].buffer,
        req.files.transactionReceipt[0].originalname,
        'registrations',
        'paper-receipts'
      );
    }

    if (req.files?.studentCard?.length) {
      studentCardUrl = await uploadFile(
        req.files.studentCard[0].buffer,
        req.files.studentCard[0].originalname,
        'registrations',
        'paper-student-cards'
      );
    }

    // Parse coAuthors if it's a JSON string
    let parsedCoAuthors = [];
    if (hasCoAuthors === true || hasCoAuthors === 'true') {
      if (typeof coAuthors === 'string') {
        try { parsedCoAuthors = JSON.parse(coAuthors); } catch { parsedCoAuthors = []; }
      } else if (Array.isArray(coAuthors)) {
        parsedCoAuthors = coAuthors;
      }
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
        transactionReceipt: transactionReceiptUrl,
        studentCard: studentCardUrl,
        certified: certified === true || certified === 'true',
        hasCoAuthors: hasCoAuthors === true || hasCoAuthors === 'true',
        coAuthors: {
          create: parsedCoAuthors.map(ca => ({
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

const addCoAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      registrationType, email, paperId, paperTitle,
      authorName, rollNo, department, institution,
      contactNo, stanTransactionId, transactionDate,
      bankDetails, totalAmountPaid, certified,
    } = req.body;

    // Verify parent paper registration exists
    const paperReg = await prisma.paperRegistration.findUnique({ where: { id } });
    if (!paperReg) {
      return res.status(404).json({ success: false, message: 'Paper registration not found' });
    }

    // Upload co-author files
    let transactionReceiptUrl = null;
    let studentCardUrl = null;

    if (req.files?.transactionReceipt?.length) {
      transactionReceiptUrl = await uploadFile(
        req.files.transactionReceipt[0].buffer,
        req.files.transactionReceipt[0].originalname,
        'registrations',
        'coauthor-receipts'
      );
    }

    if (req.files?.studentCard?.length) {
      studentCardUrl = await uploadFile(
        req.files.studentCard[0].buffer,
        req.files.studentCard[0].originalname,
        'registrations',
        'coauthor-student-cards'
      );
    }

    const coAuthor = await prisma.coAuthorRegistration.create({
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
        transactionReceipt: transactionReceiptUrl,
        studentCard: studentCardUrl,
        certified: certified === true || certified === 'true',
        paperRegistrationId: id,
      },
    });

    // Update parent to reflect co-authors exist
    await prisma.paperRegistration.update({
      where: { id },
      data: { hasCoAuthors: true },
    });

    res.status(201).json({
      success: true,
      message: 'Co-author registration submitted successfully',
      data: { id: coAuthor.id },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const registrations = await prisma.paperRegistration.findMany({
      include: { coAuthors: true },
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const registration = await prisma.paperRegistration.findUnique({
      where: { id: req.params.id },
      include: { coAuthors: true },
    });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, addCoAuthor, getAll, getById };
