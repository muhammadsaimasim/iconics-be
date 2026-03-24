-- CreateTable
CREATE TABLE "workshop_registrations" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "mobileNumber" TEXT NOT NULL,
    "cnicNumber" TEXT NOT NULL,
    "institutionOrg" TEXT NOT NULL,
    "semesterDesignation" TEXT NOT NULL,
    "professionalAddress" TEXT NOT NULL,
    "highestDegree" TEXT NOT NULL,
    "resumeUrl" TEXT,
    "quantumCourses" TEXT NOT NULL,
    "whyWorkshopHelps" TEXT NOT NULL,
    "travelArrangement" TEXT NOT NULL,
    "attendanceCertificate" BOOLEAN NOT NULL DEFAULT false,
    "termsAgreed" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workshop_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "participant_registrations" (
    "id" TEXT NOT NULL,
    "registrationType" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "rollNo" TEXT,
    "department" TEXT NOT NULL,
    "institute" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "stanTransactionId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "bankDetails" TEXT NOT NULL,
    "totalAmountPaid" TEXT NOT NULL,
    "transactionReceipt" TEXT,
    "studentCard" TEXT,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "participant_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "paper_registrations" (
    "id" TEXT NOT NULL,
    "registrationType" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "paperTitle" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rollNo" TEXT,
    "department" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "stanTransactionId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "bankDetails" TEXT NOT NULL,
    "totalAmountPaid" TEXT NOT NULL,
    "transactionReceipt" TEXT,
    "studentCard" TEXT,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "hasCoAuthors" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "paper_registrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "co_author_registrations" (
    "id" TEXT NOT NULL,
    "registrationType" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "paperId" TEXT NOT NULL,
    "paperTitle" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "rollNo" TEXT,
    "department" TEXT NOT NULL,
    "institution" TEXT NOT NULL,
    "contactNo" TEXT NOT NULL,
    "stanTransactionId" TEXT NOT NULL,
    "transactionDate" TIMESTAMP(3) NOT NULL,
    "bankDetails" TEXT NOT NULL,
    "totalAmountPaid" TEXT NOT NULL,
    "transactionReceipt" TEXT,
    "studentCard" TEXT,
    "certified" BOOLEAN NOT NULL DEFAULT false,
    "paperRegistrationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "co_author_registrations_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "co_author_registrations" ADD CONSTRAINT "co_author_registrations_paperRegistrationId_fkey" FOREIGN KEY ("paperRegistrationId") REFERENCES "paper_registrations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
