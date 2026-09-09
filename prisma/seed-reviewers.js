const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const ned = [
  ['Furqan Hussain', 'fessani@cloud.neduet.edu.pk'], ['Dr. Muhammad Kamran', 'kamran@cloud.neduet.edu.pk'], ['Dr. Usman Amjad', 'usmanamjad@cloud.neduet.edu.pk'], ['Saadiah Arshad', 'saadia@neduet.edu.pk'], ['Rohail Qamar', 'rohailqamar@cloud.neduet.edu.pk'], ['Dr. Murk Marvi', 'marvi@neduet.edu.pk'], ['Dr. Waseemullah Nazir', 'waseemu@cloud.neduet.edu.pk'], ['Dr. Muhammad Umer Farooq', 'umer@neduet.edu.pk'], ['Ms. Humata Babsam', 'humatabasm@neduet.edu.pk'], ['Dr. Abdul Karim Kazi', 'karimkazi@neduet.edu.pk'], ['Dr. Muhammad Imran'], ['Mr. Arsalan'], ['Ms. Tooba Shiekh'], ['Dr. Raheela'], ['Ms. Dureshehwar'],
];
const external = [
  ['Dr. Aqsa Aslam', 'FAST NUCES'], ['Mr. Shoaib Raza', 'FAST NUCES'], ['Ms. Anam Hamid', 'FAST NUCES'], ['Ms. Shameen', 'FAST NUCES'], ['Mr. Waseem', 'Disrupt.com'], ['Ms. Soomal Fatima', 'BAHRIA'], ['Dr. Syed Zafar Qasim', 'CIS, NEDUET'], ['Ms. Safia', 'GIKI'], ['Ms. Asma Qaiser', 'IQRA'], ['Dr. Syed Muhammad Faraz Hyder', 'SW, NEDUET'], ['Dr. Anam Qureshi', 'FAST NUCES'], ['Dr. Muhammad Najmul Islam Farooq', 'IoBM'], ['Dr. Syed Muhammad Sheeraz', 'SW, NEDUET'], ['Dr. Tahir Malik', 'NED UET'], ['Dr. Anam Qureshi', 'FAST NUCES'], ['Dr. Khalid Mahboob', 'IoBM'], ['Dr. Urooj Waheed', 'Suffa University'], ['Dr. Muhammad Hassan Nasir'], ['Dr. Hameeza', 'CIS, NEDUET'], ['Dr. Saad Akber', 'Hamdard'], ['Mr. Usman Ahsan', 'UNSW'], ['Mr. Muhammad Shahzad', 'Bahria University'],
];

async function seed(records, isNed, startOrder) {
  for (const [name, fromOrEmail] of records) {
    const existing = await prisma.reviewer.findFirst({ where: { name, isNed } });
    if (!existing) await prisma.reviewer.create({ data: isNed ? { name, email: fromOrEmail || null, isNed, order: startOrder++ } : { name, from: fromOrEmail || null, isNed, order: startOrder++ } });
  }
}

async function main() { await seed(ned, true, 1); await seed(external, false, 100); console.log('Reviewer seed complete.'); }
main().catch(console.error).finally(() => prisma.$disconnect());
