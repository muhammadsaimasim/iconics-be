const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // ── Speakers ────────────────────────────────────────────────────────────────
  await prisma.speaker.deleteMany();
  await prisma.speaker.createMany({
    data: [
      {
        name: 'Prof. Dr. Marco Genovese',
        title: 'Professor',
        institution: 'INRIM (National Institute of Metrological Research)',
        country: 'Italy',
        photo: '/images/Marco.jpg',
        type: 'keynote',
        bio: 'Professor Marco Genovese is a leading researcher in quantum optics and quantum information. His work focuses on quantum communication, quantum cryptography, and foundations of quantum mechanics. He has published over 200 papers in international journals and is recognized globally for his contributions to quantum technologies.',
        topics: ['Quantum Technologies', 'Quantum Optics', 'Quantum Information'],
        website: '#', linkedin: '#', scholar: '#', order: 1,
      },
      {
        name: 'Prof. Dr. Irfan Siddiqi',
        title: 'Professor',
        institution: 'Department of Physics, UC Berkeley',
        country: 'USA',
        photo: '/images/irfan.jpg',
        type: 'keynote',
        bio: 'Professor Irfan Siddiqi is a leading experimental physicist working on quantum information science and superconducting quantum circuits. His research group develops quantum processors and explores quantum error correction. He is a pioneer in the field of quantum computing hardware.',
        topics: ['Quantum Computing', 'Superconducting Circuits', 'Quantum Information'],
        website: '#', linkedin: '#', scholar: '#', order: 2,
      },
      {
        name: 'Dr. Manzoor Ikram',
        title: 'Director',
        institution: 'National Institute of Lasers and Optronics (NILOP)',
        country: 'Pakistan',
        photo: '/images/manzoor.jpg',
        type: 'keynote',
        bio: 'Dr. Manzoor Ikram is the Director of the National Institute of Lasers and Optronics (NILOP) in Islamabad. His research focuses on laser technology, quantum optics, and photonics. He has made significant contributions to advancing optical sciences in Pakistan.',
        topics: ['Laser Technology', 'Quantum Optics', 'Photonics'],
        website: '#', linkedin: '#', scholar: '#', order: 3,
      },
      {
        name: 'Prof. Rafael Ferreira Mello',
        title: 'Professor',
        institution: 'Federal Rural University of Pernambuco (UFRPE)',
        country: 'Brazil',
        photo: '/images/Mello.jpg',
        type: 'keynote',
        bio: 'Professor Rafael Ferreira Mello is a researcher in educational data mining and learning analytics. His work focuses on applying machine learning and data science techniques to improve educational outcomes and understand learning processes.',
        topics: ['Educational Data Mining', 'Learning Analytics', 'AI in Education'],
        website: '#', linkedin: '#', scholar: '#', order: 4,
      },
      {
        name: 'Prof. Dr. Muhammad Atif Tahir',
        title: 'Professor & Head of School (FSC)',
        institution: 'FAST University Karachi',
        country: 'Pakistan',
        photo: '/images/atif.jpg',
        type: 'keynote',
        bio: 'Professor Dr. Muhammad Atif Tahir is Head of School of Computing at FAST University Karachi. His research interests include computer vision, machine learning, and pattern recognition. He has supervised numerous research projects and published extensively in top-tier conferences.',
        topics: ['Computer Vision', 'Machine Learning', 'Pattern Recognition'],
        website: '#', linkedin: '#', scholar: '#', order: 5,
      },
      {
        name: 'Prof. Dr. Jawwad A. Shamsi',
        title: 'Professor & Dean',
        institution: 'FAST University Karachi',
        country: 'Pakistan',
        photo: '/images/jawwad.jpg',
        type: 'keynote',
        bio: 'Professor Dr. Jawwad A. Shamsi is Dean and Professor at FAST University Karachi. His research focuses on distributed systems, cloud computing, and software engineering. He has extensive experience in both academia and industry.',
        topics: ['Distributed Systems', 'Cloud Computing', 'Software Engineering'],
        website: '#', linkedin: '#', scholar: '#', order: 6,
      },
      {
        name: 'Dr. Mubashir Rehmani',
        title: 'Young Scientist & Researcher',
        institution: 'Munster Technological University',
        country: 'Ireland',
        photo: '/images/Rehmani.jpg',
        type: 'keynote',
        bio: 'Dr. Mubashir Rehmani is a young scientist and researcher at Munster Technological University. His research interests include Internet of Things (IoT), blockchain technology, and wireless sensor networks. He is an active contributor to the research community.',
        topics: ['Internet of Things', 'Blockchain', 'Wireless Networks'],
        website: '#', linkedin: '#', scholar: '#', order: 7,
      },
      {
        name: 'Prof. Dr. Muhammad Rafi',
        title: 'Professor & Department Head (AI & DS)',
        institution: 'FAST University Karachi',
        country: 'Pakistan',
        photo: '/images/rafi.jpg',
        type: 'workshop',
        bio: 'Professor Dr. Muhammad Rafi heads the Department of AI & Data Science at FAST University Karachi. His expertise includes artificial intelligence, data science, and natural language processing. He has led multiple research initiatives in AI applications.',
        topics: ['Artificial Intelligence', 'Data Science', 'Natural Language Processing'],
        website: '#', linkedin: '#', scholar: '#', order: 8,
      },
      {
        name: 'Dr. Jibran Rashid',
        title: 'Assistant Professor',
        institution: 'Institute of Business Administration (IBA)',
        country: 'Pakistan',
        photo: '/images/jibran.jpg',
        type: 'workshop',
        bio: 'Dr. Jibran Rashid is an Assistant Professor at IBA Karachi. His research focuses on data analytics, business intelligence, and applied machine learning. He bridges the gap between academic research and industry applications.',
        topics: ['Data Analytics', 'Business Intelligence', 'Applied ML'],
        website: '#', linkedin: '#', scholar: '#', order: 9,
      },
    ],
  });
  console.log('✓ Speakers seeded');

  // ── Workshops ────────────────────────────────────────────────────────────────
  await prisma.workshopSession.deleteMany();
  await prisma.workshop.deleteMany();

  const quantum = await prisma.workshop.create({
    data: {
      slug: 'quantum-technologies',
      title: 'Quantum Technologies Workshop',
      tagline: 'Diving into the transformative world of Quantum Technologies',
      description: 'An exclusive multi-track workshop exploring the frontiers of quantum computing, quantum metrology, and quantum algorithms. Led by world-class researchers from UC Berkeley and INRIM Italy, this workshop offers deep technical sessions for researchers and practitioners.',
      registrationLink: 'https://forms.gle/agvfFDFgodnG2s8u7',
      learningOutcomes: [],
      order: 1,
    },
  });

  await prisma.workshopSession.createMany({
    data: [
      {
        workshopId: quantum.id,
        title: 'Quantum Computing',
        instructorName: 'Prof. Dr. Irfan Siddiqi',
        instructorTitle: 'Professor',
        instructorInstitution: 'Department of Physics, UC Berkeley',
        instructorCountry: 'USA',
        instructorPhoto: '/images/irfan.jpg',
        topics: [
          'Gates and noise mitigation', 'CNOT and Toffoli operations',
          'Cross-resonance driving', 'Parametric gates', 'Floquet qubits',
          'Randomized benchmarking', 'Gate set tomography',
          'Coherent and stochastic errors', 'Randomized compiling',
        ],
        order: 1,
      },
      {
        workshopId: quantum.id,
        title: 'Quantum Metrology, Sensing & Imaging',
        instructorName: 'Prof. Dr. Marco Genovese',
        instructorTitle: 'Research Director, Quantum Optics Sector',
        instructorInstitution: 'INRIM (National Institute of Metrological Research)',
        instructorCountry: 'Italy',
        instructorPhoto: '/images/Marco.jpg',
        topics: [
          'Beating the Heisenberg limit', 'Shot noise experiments',
          'Diffuse quantum metrology on quantum internet', 'Color centers in diamonds',
          'Rydberg atom sensors', 'Quantum optical sensing and imaging',
        ],
        order: 2,
      },
      {
        workshopId: quantum.id,
        title: 'Quantum Algorithms',
        instructorName: 'Dr. Jibran Rashid',
        instructorTitle: 'Assistant Professor',
        instructorInstitution: 'Institute of Business Administration (IBA)',
        instructorCountry: 'Pakistan',
        instructorPhoto: '/images/jibran.jpg',
        topics: [
          'Introduction to quantum algorithms',
          'Quantum interactive proofs',
          'Identifying sources of quantum advantage',
        ],
        order: 3,
      },
    ],
  });

  const nlp = await prisma.workshop.create({
    data: {
      slug: 'nlp-contrastive-learning',
      title: 'Implementing Contrastive Learning for Word Embedding in NLP',
      tagline: 'Robust, context-aware word representations for modern NLP',
      description: 'This tutorial introduces participants to contrastive learning for creating robust word embeddings. It contrasts traditional static approaches (Word2Vec, GloVe) with dynamic, context-aware representations, demonstrating practical integration methods and real-world uses in information retrieval, semantic search, and text classification.',
      registrationLink: 'https://forms.gle/GP2xWDdHjaM6XSDQ8',
      targetAudience: 'Students, faculty, researchers, and practitioners in NLP and ML familiar with word embeddings and basic deep learning. Intermediate Python skills and foundational knowledge of representation learning required.',
      learningOutcomes: [
        'Grasp contrastive learning fundamentals in word embedding contexts',
        'Implement and evaluate contrastive word embedding models',
        'Explore advanced contrastive learning topics for future NLP research',
        'Receive handouts and code samples',
      ],
      order: 2,
    },
  });

  await prisma.workshopSession.create({
    data: {
      workshopId: nlp.id,
      title: 'Contrastive Learning for NLP',
      instructorName: 'Prof. Dr. Muhammad Rafi',
      instructorTitle: 'Professor & Department Head (AI & DS)',
      instructorInstitution: 'FAST National University, Karachi',
      instructorCountry: 'Pakistan',
      instructorPhoto: '/images/rafi.jpg',
      topics: [
        'Contrastive learning fundamentals in word embedding contexts',
        'Implementing contrastive word embedding models',
        'Evaluation of contrastive embeddings',
        'Information retrieval applications',
        'Semantic search and text classification',
        'Advanced topics for future NLP research',
      ],
      order: 1,
    },
  });
  console.log('✓ Workshops seeded');

  // ── Important Dates ──────────────────────────────────────────────────────────
  await prisma.importantDate.deleteMany();
  await prisma.importantDate.createMany({
    data: [
      { date: 'July 30, 2026', title: 'Paper Submission Deadline', description: 'Final date for paper submissions via PaperDesk', order: 1 },
      { date: 'August 30, 2026', title: 'Notification of Acceptance', description: 'Authors will be notified via email', order: 2 },
      { date: 'September 15, 2026', title: 'Camera-Ready Submission', description: 'Submit final version of accepted papers', order: 3 },
      { date: 'September 20, 2026', title: 'Early Bird Registration', description: 'Last day for discounted registration fees', order: 4 },
      { date: 'October 20-21, 2026', title: 'Conference Dates', description: 'Main conference event at NED University', order: 5 },
    ],
  });
  console.log('✓ Important Dates seeded');

  // ── Tracks ───────────────────────────────────────────────────────────────────
  await prisma.trackTopic.deleteMany();
  await prisma.track.deleteMany();

  const tracksData = [
    { name: 'Artificial Intelligence and Machine Learning', icon: '🤖', order: 1, topics: ['Artificial Intelligence', 'Neural Networks & Deep Learning', 'Large Language Models & Generative AI', 'Agentic AI & Autonomous Systems', 'Explainable & Trustworthy AI', 'AI Ethics & Governance', 'Computer Vision & Pattern Recognition', 'Speech & Natural Language Processing'] },
    { name: 'Data, Cloud & Computing', icon: '☁️', order: 2, topics: ['Big Data Analytics', 'Cloud Computing', 'Edge AI & TinyML', 'Green & Sustainable Computing', 'High Performance Computing', 'Digital Twins'] },
    { name: 'Security & Cryptography', icon: '🔒', order: 3, topics: ['Cyber Security', 'Network Security', 'Blockchain Technologies', 'Quantum Cryptography', 'Post-Quantum Cryptography', 'AI Security & Adversarial ML'] },
    { name: 'Quantum & Emerging Technologies', icon: '⚛️', order: 4, topics: ['Quantum Computing', 'Quantum AI for Decision Making', 'Quantum Simulators', 'Neuromorphic Computing', 'Evolutionary Computation'] },
    { name: 'Networks, IoT & Smart Systems', icon: '📡', order: 5, topics: ['Internet of Things (IoT)', 'Computer Networks', '6G & Next-Gen Networks', 'Wireless Sensor Networks (WSN)', 'Smart City Architecture'] },
    { name: 'Software, Web & Applications', icon: '💻', order: 6, topics: ['Software Engineering', 'Web Technologies', 'Data Mining', 'Multimodal AI Systems', 'AI in Healthcare & Bioinformatics'] },
  ];

  for (const t of tracksData) {
    const track = await prisma.track.create({ data: { name: t.name, icon: t.icon, order: t.order } });
    await prisma.trackTopic.createMany({
      data: t.topics.map((name, i) => ({ trackId: track.id, name, order: i + 1 })),
    });
  }
  console.log('✓ Tracks seeded');

  console.log('✅ Seed complete!');
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
