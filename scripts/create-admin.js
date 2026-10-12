/**
 * Create an admin account, or reset an existing admin's password.
 *
 *   node scripts/create-admin.js <email> "<name>"
 *
 * The password is read from the ADMIN_PASSWORD env var if set, otherwise
 * prompted for (input hidden). Resetting a password also signs that admin
 * out everywhere.
 *
 * Disable an account:  node scripts/create-admin.js --disable <email>
 */
require('dotenv').config();
const readline = require('readline');
const bcrypt = require('bcryptjs');
const prisma = require('../utils/prisma');

function promptHidden(question) {
  return new Promise((resolve) => {
    const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
    rl._writeToOutput = (s) => { if (s.includes(question)) rl.output.write(s); };
    rl.question(question, (answer) => { rl.close(); process.stdout.write('\n'); resolve(answer); });
  });
}

async function main() {
  const args = process.argv.slice(2);

  if (args[0] === '--disable') {
    const email = (args[1] || '').trim().toLowerCase();
    await prisma.admin.update({ where: { email }, data: { isActive: false, tokenVersion: { increment: 1 } } });
    console.log(`Disabled ${email} and revoked its sessions.`);
    return;
  }

  const [rawEmail, name] = args;
  const email = (rawEmail || '').trim().toLowerCase();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !name) {
    console.error('Usage: node scripts/create-admin.js <email> "<name>"');
    process.exit(1);
  }

  let password = process.env.ADMIN_PASSWORD;
  if (!password) {
    password = await promptHidden('Password (min 12 chars): ');
    const confirm = await promptHidden('Confirm password: ');
    if (password !== confirm) { console.error('Passwords do not match.'); process.exit(1); }
  }
  if (password.length < 12) { console.error('Password must be at least 12 characters.'); process.exit(1); }

  const passwordHash = await bcrypt.hash(password, 12);
  const admin = await prisma.admin.upsert({
    where: { email },
    update: { name, passwordHash, isActive: true, tokenVersion: { increment: 1 } },
    create: { email, name, passwordHash },
  });
  console.log(`Admin ready: ${admin.email}`);
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
