const prisma = require('../../utils/prisma');
const { uploadFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      registrationType, email, fullName, rollNo,
      department, institute, contactNo,
      stanTransactionId, transactionDate, bankDetails,
      totalAmountPaid, certified,
    } = req.body;

    // Upload files
    let transactionReceiptUrl = null;
    let studentCardUrl = null;

    if (req.files?.transactionReceipt?.length) {
      transactionReceiptUrl = await uploadFile(
        req.files.transactionReceipt[0].buffer,
        req.files.transactionReceipt[0].originalname,
        'registrations',
        'participant-receipts'
      );
    }

    if (req.files?.studentCard?.length) {
      studentCardUrl = await uploadFile(
        req.files.studentCard[0].buffer,
        req.files.studentCard[0].originalname,
        'registrations',
        'participant-student-cards'
      );
    }

    const registration = await prisma.participantRegistration.create({
      data: {
        registrationType,
        email,
        fullName,
        rollNo: rollNo || null,
        department,
        institute,
        contactNo,
        stanTransactionId,
        transactionDate: new Date(transactionDate),
        bankDetails,
        totalAmountPaid,
        transactionReceipt: transactionReceiptUrl,
        studentCard: studentCardUrl,
        certified: certified === true || certified === 'true',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Participant registration submitted successfully',
      data: { id: registration.id },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const registrations = await prisma.participantRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const registration = await prisma.participantRegistration.findUnique({
      where: { id: req.params.id },
    });
    if (!registration) {
      return res.status(404).json({ success: false, message: 'Registration not found' });
    }
    res.json({ success: true, data: registration });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, getAll, getById };
