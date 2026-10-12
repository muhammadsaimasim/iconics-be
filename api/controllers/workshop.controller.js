const prisma = require('../../utils/prisma');
const { uploadPrivateFile } = require('../../utils/supabase');

const register = async (req, res, next) => {
  try {
    const {
      email, fullName, mobileNumber, cnicNumber,
      institutionOrg, semesterDesignation, professionalAddress,
      highestDegree, quantumCourses, whyWorkshopHelps,
      travelArrangement, attendanceCertificate, termsAgreed,
    } = req.body;

    // Upload resume if provided (stored as a private object path, not a public URL)
    let resumeUrl = null;
    if (req.file) {
      resumeUrl = await uploadPrivateFile(
        req.file.buffer,
        req.file.originalname,
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

module.exports = { register };
