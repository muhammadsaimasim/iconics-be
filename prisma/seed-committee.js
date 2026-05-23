const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const INSTITUTION = 'NED University of Engineering & Technology';

const committeeData = [
  // ── Organizing Committee ──────────────────────────────────────────────────
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Muhammad Tufail',       role: 'Patron-in-Chief',                      isChair: false, order: 1 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Noman Ahmed',            role: 'Co-Patron',                            isChair: false, order: 2 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Saad Ahmed Qazi',        role: 'Vice Patron',                          isChair: false, order: 3 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Muhammad Mubashir Khan', role: 'Conference Chair',                     isChair: true,  order: 4 },
  { committeeName: 'Organizing Committee', name: 'Dr. Muhammad Shahid Shaikh',       role: 'Conference Co-Chair',                  isChair: false, order: 5 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Shariq Mahmood Khan',    role: 'Conference Co-Chair',                  isChair: false, order: 6 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Raheela Asif',           role: 'Conference Co-Chair',                  isChair: false, order: 7 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Shariq Mahmood Khan',    role: 'Technical Program Chair',              isChair: false, order: 8 },
  { committeeName: 'Organizing Committee', name: 'Prof. Dr. Raheela Asif',           role: 'IEEE Computer Society Representative', isChair: false, order: 9 },
  { committeeName: 'Organizing Committee', name: 'Dr. Usman Amjad',                  role: 'Conference Secretary',                 isChair: false, order: 10 },
  { committeeName: 'Organizing Committee', name: 'Dr. Murk Marvi',                   role: 'Publication Chair',                    isChair: false, order: 11 },
  { committeeName: 'Organizing Committee', name: 'Dr. Waseemullah Nazir',            role: 'Conference Treasurer',                 isChair: false, order: 12 },

  // ── IEEE Coordination Committee ────────────────────────────────────────────
  { committeeName: 'IEEE Coordination Committee', name: 'Prof. Dr. Raheela Asif',  role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'IEEE Coordination Committee', name: 'Mr. Rohail Qamar',         role: 'Member', isChair: false, order: 2 },
  { committeeName: 'IEEE Coordination Committee', name: 'Ms. Syeda Sahar Fatima',   role: 'Member', isChair: false, order: 3 },

  // ── Publications Committee ─────────────────────────────────────────────────
  { committeeName: 'Publications Committee', name: 'Dr. Murk Marvi',          role: 'Chair/Editor', isChair: true,  order: 1 },
  { committeeName: 'Publications Committee', name: 'Dr. Abdul Karim Kazi',    role: 'Member',       isChair: false, order: 2 },
  { committeeName: 'Publications Committee', name: 'Ms. Huma Tabassum',       role: 'Member',       isChair: false, order: 3 },
  { committeeName: 'Publications Committee', name: 'Ms. Saadia Arshad',       role: 'Member',       isChair: false, order: 4 },
  { committeeName: 'Publications Committee', name: 'Ms. Dureshahwar Waseem',  role: 'Member',       isChair: false, order: 5 },

  // ── Technical Program Committee ────────────────────────────────────────────
  { committeeName: 'Technical Program Committee', name: 'Prof. Dr. Shariq Mahmood Khan', role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Technical Program Committee', name: 'Dr. Muhammad Imran',             role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Technical Program Committee', name: 'Engr. Firdous Riaz',             role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Technical Program Committee', name: 'Mr. Rohail Qamar',               role: 'Member', isChair: false, order: 4 },
  { committeeName: 'Technical Program Committee', name: 'Mr. Ahmed Zaki Sheikh',          role: 'Member', isChair: false, order: 5 },
  { committeeName: 'Technical Program Committee', name: 'Mr. Wasiq Noor',                 role: 'Member', isChair: false, order: 6 },

  // ── Finance Committee ──────────────────────────────────────────────────────
  { committeeName: 'Finance Committee', name: 'Dr. Waseemullah',                   role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Finance Committee', name: 'Mr. Muhammad Ahmed Zaki Shaikh',    role: 'Member', isChair: false, order: 2 },

  // ── Website And Socials Committee ─────────────────────────────────────────
  { committeeName: 'Website & Socials Committee', name: 'Dr. Maria Andleeb',   role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Website & Socials Committee', name: 'Ms. Saadia Arshad',   role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Website & Socials Committee', name: 'Ms. Samia Masood',    role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Website & Socials Committee', name: 'Ms. Nazish Irfan',    role: 'Member', isChair: false, order: 4 },
  { committeeName: 'Website & Socials Committee', name: 'Mr. Haroon',          role: 'Member', isChair: false, order: 5 },

  // ── Grants & Sponsorship Committee ───────────────────────────────────────
  { committeeName: 'Grants & Sponsorship Committee', name: 'Dr. Muhammad Umer Farooq', role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Grants & Sponsorship Committee', name: 'Dr. Muhammad Imran',        role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Grants & Sponsorship Committee', name: 'Mr. Furqan Hussain Essani', role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Grants & Sponsorship Committee', name: 'Mr. Ahmed Zaki Sheikh',     role: 'Member', isChair: false, order: 4 },
  { committeeName: 'Grants & Sponsorship Committee', name: 'Mr. Muhammad Hammad',       role: 'Member', isChair: false, order: 5 },
  { committeeName: 'Grants & Sponsorship Committee', name: 'Mr. Wasiq Noor',            role: 'Member', isChair: false, order: 6 },

  // ── Travel, Accommodation & Protocol Committee ────────────────────────────
  { committeeName: 'Travel, Accommodation & Protocol Committee', name: 'Dr. Muhammad Kamran',    role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Travel, Accommodation & Protocol Committee', name: 'Mr. Muhammad Wajhiuddin', role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Travel, Accommodation & Protocol Committee', name: 'Mr. Imdadullah',          role: 'Member', isChair: false, order: 3 },

  // ── Publicity Committee ───────────────────────────────────────────────────
  { committeeName: 'Publicity Committee', name: 'Dr. Maria Andleeb Siddiqui', role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Publicity Committee', name: 'Ms. Samia Masood Awan',      role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Publicity Committee', name: 'Ms. Saadia Arsha',           role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Publicity Committee', name: 'Ms. Dua Agha',               role: 'Member', isChair: false, order: 4 },
  { committeeName: 'Publicity Committee', name: 'Ms. Hamnah Rashid',          role: 'Member', isChair: false, order: 5 },

  // ── Shield & Certificates Committee ──────────────────────────────────────
  { committeeName: 'Shield & Certificates Committee', name: 'Dr. Waseemullah',   role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Shield & Certificates Committee', name: 'Mr. Rohail Qamar',  role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Shield & Certificates Committee', name: 'Mr. Haroon',        role: 'Member', isChair: false, order: 3 },

  // ── Registration Committee ────────────────────────────────────────────────
  { committeeName: 'Registration Committee', name: 'Dr. Maria Andleeb',  role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Registration Committee', name: 'Ms. Samia Masood',   role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Registration Committee', name: 'Ms. Amna Ahmed',     role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Registration Committee', name: 'Ms. Mehar Fatima',   role: 'Member', isChair: false, order: 4 },

  // ── Reception Committee ───────────────────────────────────────────────────
  { committeeName: 'Reception Committee', name: 'Ms. Saba Izhar Haque',    role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Reception Committee', name: 'Ms. Dua Agha',            role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Reception Committee', name: 'Ms. Sayyda Sahar Fatima', role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Reception Committee', name: 'Ms. Hamnah Rashid',       role: 'Member', isChair: false, order: 4 },

  // ── Catering Committee ────────────────────────────────────────────────────
  { committeeName: 'Catering Committee', name: 'Dr. Muhammad Umer Farooq', role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'Catering Committee', name: 'Mr. Wasiq Noor',           role: 'Member', isChair: false, order: 2 },
  { committeeName: 'Catering Committee', name: 'Mr. Muhammad Hammad',      role: 'Member', isChair: false, order: 3 },
  { committeeName: 'Catering Committee', name: 'Mr. Imdadullah',           role: 'Member', isChair: false, order: 4 },

  // ── IT Support Committee ──────────────────────────────────────────────────
  { committeeName: 'IT Support Committee', name: 'Mr. Zahid Nazir',          role: 'Chair',  isChair: true,  order: 1 },
  { committeeName: 'IT Support Committee', name: 'Ms. Noor Afshan Vasty',    role: 'Member', isChair: false, order: 2 },
  { committeeName: 'IT Support Committee', name: 'Ms. Nazish Irfan',         role: 'Member', isChair: false, order: 3 },
  { committeeName: 'IT Support Committee', name: 'Mr. Muhammad Noman Khan',  role: 'Member', isChair: false, order: 4 },
];

async function main() {
  console.log('Seeding committee members...');
  await prisma.committeeMember.deleteMany();
  await prisma.committeeMember.createMany({
    data: committeeData.map((m, i) => ({ ...m, institution: INSTITUTION, order: i })),
  });
  console.log(`Inserted ${committeeData.length} committee members.`);
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
