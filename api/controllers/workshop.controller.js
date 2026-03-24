const prisma = require('../../utils/prisma');
const { uploadFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      email, fullName, mobileNumber, cnicNumber,
      institutionOrg, semesterDesignation, professionalAddress,
      highestDegree, quantumCourses, whyWorkshopHelps,
      travelArrangement, attendanceCertificate, termsAgreed,
    } = req.body;

    // Upload resume if provided
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = await uploadFile(
        req.file.buffer,
        req.file.originalname,
        'registrations',
        'workshop-resumes'
      );
    }

    const registration = await prisma.workshopRegistration.create({
      data: {
        email,
        fullName,
        mobileNumber,
        cnicNumber,
        institutionOrg,
        semesterDesignation,
        professionalAddress,
        highestDegree,
        resumeUrl,
        quantumCourses,
        whyWorkshopHelps,
        travelArrangement,
        attendanceCertificate: attendanceCertificate === true || attendanceCertificate === 'true',
        termsAgreed: termsAgreed === true || termsAgreed === 'true',
      },
    });

    res.status(201).json({
      success: true,
      message: 'Workshop registration submitted successfully',
      data: { id: registration.id },
    });
  } catch (error) {
    next(error);
  }
};

const getAll = async (_req, res, next) => {
  try {
    const registrations = await prisma.workshopRegistration.findMany({
      orderBy: { createdAt: 'desc' },
    });
    res.json({ success: true, data: registrations });
  } catch (error) {
    next(error);
  }
};

const getById = async (req, res, next) => {
  try {
    const registration = await prisma.workshopRegistration.findUnique({
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
