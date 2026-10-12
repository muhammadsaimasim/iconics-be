const prisma = require('../../utils/prisma');
const { uploadPrivateFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      registrationType, email, fullName, rollNo,
      department, institute, contactNo,
      stanTransactionId, transactionDate, bankDetails,
      totalAmountPaid, certified, ieeeNumber,
    } = req.body;

    // IEEE numbers unlock a discount / fee waiver, so each may be used only once.
    // Enforced here too: the check-ieee endpoint is only a UX hint.
    const ieee = ieeeNumber?.trim() || null;
    if (ieee) {
      const existing = await prisma.participantRegistration.findFirst({
        where: { ieeeNumber: ieee },
        select: { id: true },
      });
      if (existing) {
        return res.status(409).json({ success: false, message: 'This IEEE number has already been used for a registration.' });
      }
    }

    // Upload files (stored as private object paths, not public URLs)
    let transactionReceiptPath = null;
    let studentCardPath = null;

    if (req.files?.transactionReceipt?.length) {
      transactionReceiptPath = await uploadPrivateFile(
        req.files.transactionReceipt[0].buffer,
        req.files.transactionReceipt[0].originalname,
        'participant-receipts'
      );
    }

    if (req.files?.studentCard?.length) {
      studentCardPath = await uploadPrivateFile(
        req.files.studentCard[0].buffer,
        req.files.studentCard[0].originalname,
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
        transactionReceipt: transactionReceiptPath,
        studentCard: studentCardPath,
        certified: certified === true || certified === 'true',
        ieeeNumber: ieee,
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

const checkIeee = async (req, res, next) => {
  try {
    const existing = await prisma.participantRegistration.findFirst({
      where: { ieeeNumber: req.query.number.trim() },
      select: { id: true },
    });
    res.json({ success: true, taken: !!existing });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, checkIeee };
