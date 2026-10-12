/**
 * One-off migration for audit item C3: make registrant documents private.
 *
 *   node scripts/migrate-private-storage.js                  # dry run, changes nothing
 *   node scripts/migrate-private-storage.js --apply          # copy images + rewrite DB rows
 *   node scripts/migrate-private-storage.js --make-private   # then flip the bucket to private
 *
 * Steps:
 *  1. Ensure the public bucket (SUPABASE_PUBLIC_BUCKET, default "public-assets") exists.
 *  2. Copy speaker/reviewer/workshop/session images out of the documents bucket into
 *     the public bucket and point the DB rows at the new public URLs.
 *  3. Rewrite registration document columns from public URLs to bare object paths.
 *  4. (--make-private) Set the documents bucket to private. Do this only after 2 and 3
 *     succeeded and the new backend code is deployed.
 *
 * Safe to re-run: rows already migrated are skipped.
 */
require('dotenv').config();
const prisma = require('../utils/prisma');
const { supabase, PRIVATE_BUCKET, PUBLIC_BUCKET, toPrivatePath } = require('../utils/supabase');

const APPLY = process.argv.includes('--apply');
const MAKE_PRIVATE = process.argv.includes('--make-private');

const IMAGE_COLUMNS = [
  { model: 'speaker', field: 'photo' },
  { model: 'reviewer', field: 'photo' },
  { model: 'workshop', field: 'posterImage' },
  { model: 'workshopSession', field: 'instructorPhoto' },
];

const DOCUMENT_COLUMNS = [
  { model: 'workshopRegistration', field: 'resumeUrl' },
  { model: 'participantRegistration', field: 'transactionReceipt' },
  { model: 'participantRegistration', field: 'studentCard' },
  { model: 'paperRegistration', field: 'transactionReceipt' },
  { model: 'paperRegistration', field: 'studentCard' },
  { model: 'coAuthorRegistration', field: 'transactionReceipt' },
  { model: 'coAuthorRegistration', field: 'studentCard' },
];

const isLegacyUrl = (v) => typeof v === 'string' && v.includes(`/storage/v1/object/public/${PRIVATE_BUCKET}/`);

async function ensurePublicBucket() {
  const { data } = await supabase.storage.getBucket(PUBLIC_BUCKET);
  if (data) return console.log(`Public bucket "${PUBLIC_BUCKET}" exists.`);
  console.log(`Public bucket "${PUBLIC_BUCKET}" missing${APPLY ? ', creating' : ' (would create)'}.`);
  if (APPLY) {
    const { error } = await supabase.storage.createBucket(PUBLIC_BUCKET, {
      public: true,
      fileSizeLimit: '5MB',
      allowedMimeTypes: ['image/png', 'image/jpeg', 'image/webp'],
    });
    if (error) throw new Error(`createBucket: ${error.message}`);
  }
}

async function migrateImages() {
  for (const { model, field } of IMAGE_COLUMNS) {
    const rows = await prisma[model].findMany({ select: { id: true, [field]: true } });
    for (const row of rows) {
      const value = row[field];
      if (!isLegacyUrl(value)) continue;
      const objectPath = toPrivatePath(value);
      console.log(`  image ${model}.${field} ${row.id}: ${objectPath}`);
      if (!APPLY) continue;

      const { data: blob, error: dlErr } = await supabase.storage.from(PRIVATE_BUCKET).download(objectPath);
      if (dlErr) { console.warn(`    ! download failed: ${dlErr.message}`); continue; }
      const buffer = Buffer.from(await blob.arrayBuffer());
      const { error: upErr } = await supabase.storage.from(PUBLIC_BUCKET)
        .upload(objectPath, buffer, { contentType: blob.type || undefined, upsert: true });
      if (upErr) { console.warn(`    ! upload failed: ${upErr.message}`); continue; }

      const { data: pub } = supabase.storage.from(PUBLIC_BUCKET).getPublicUrl(objectPath);
      await prisma[model].update({ where: { id: row.id }, data: { [field]: pub.publicUrl } });
    }
  }
}

async function migrateDocuments() {
  let count = 0;
  for (const { model, field } of DOCUMENT_COLUMNS) {
    const rows = await prisma[model].findMany({ select: { id: true, [field]: true } });
    for (const row of rows) {
      if (!isLegacyUrl(row[field])) continue;
      count++;
      if (APPLY) {
        await prisma[model].update({ where: { id: row.id }, data: { [field]: toPrivatePath(row[field]) } });
      }
    }
  }
  console.log(`Registration document references to convert to paths: ${count}${APPLY ? ' (done)' : ''}`);
}

async function makePrivate() {
  const { error } = await supabase.storage.updateBucket(PRIVATE_BUCKET, {
    public: false,
    fileSizeLimit: '10MB',
  });
  if (error) throw new Error(`updateBucket: ${error.message}`);
  console.log(`Bucket "${PRIVATE_BUCKET}" is now PRIVATE.`);
}

async function main() {
  if (MAKE_PRIVATE) return makePrivate();

  console.log(APPLY ? '=== APPLYING ===' : '=== DRY RUN (pass --apply to write) ===');
  await ensurePublicBucket();
  await migrateImages();
  await migrateDocuments();
  console.log(APPLY
    ? '\nDone. Check the public site still shows speaker/reviewer/workshop images, then run with --make-private.'
    : '\nNothing was changed.');
}

main()
  .catch((e) => { console.error(e.message); process.exit(1); })
  .finally(() => prisma.$disconnect());
