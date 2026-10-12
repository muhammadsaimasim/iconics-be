const prisma = require('../../../utils/prisma');
const { toPrivatePath, createSignedUrl } = require('../../../utils/supabase');

// ── helpers ───────────────────────────────────────────────────────────────────

function toCSV(rows, columns) {
  const escape = (v) => {
    let s = v == null ? '' : (v instanceof Date ? v.toISOString() : String(v));
    // Registrant-supplied text starting with = + - @ (or tab/CR) is run as a
    // formula by Excel/Sheets. Prefix with ' so it is shown as plain text.
    // Purely numeric values (e.g. "+92 300 1234567") can't carry a payload and are left as-is.
    if (/^[=+\-@\t\r]/.test(s) && !/^[+-]?[\d\s().-]+$/.test(s)) s = `'${s}`;
    return `"${s.replace(/"/g, '""')}"`;
  };
  const header = columns.map((c) => escape(c.label)).join(',');
  const body = rows.map((row) => columns.map((c) => escape(row[c.key])).join(',')).join('\n');
  return `${header}\n${body}`;
}

// ── Workshop Registrations ────────────────────────────────────────────────────

const getWorkshop = async (_req, res, next) => {
  try {
    const data = await prisma.workshopRegistration.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const exportWorkshop = async (_req, res, next) => {
  try {
    const rows = await prisma.workshopRegistration.findMany({ orderBy: { createdAt: 'desc' } });
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'mobileNumber', label: 'Mobile' },
      { key: 'cnicNumber', label: 'CNIC' },
      { key: 'institutionOrg', label: 'Institution' },
      { key: 'semesterDesignation', label: 'Semester/Designation' },
      { key: 'highestDegree', label: 'Highest Degree' },
      { key: 'travelArrangement', label: 'Travel Arrangement' },
      { key: 'attendanceCertificate', label: 'Certificate Requested' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Submitted At' },
    ];
    const csv = toCSV(rows, columns);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="workshop-registrations.csv"');
    res.send(csv);
  } catch (e) { next(e); }
};

// ── Participant Registrations ─────────────────────────────────────────────────

const getParticipant = async (_req, res, next) => {
  try {
    const data = await prisma.participantRegistration.findMany({ orderBy: { createdAt: 'desc' } });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const exportParticipant = async (_req, res, next) => {
  try {
    const rows = await prisma.participantRegistration.findMany({ orderBy: { createdAt: 'desc' } });
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'fullName', label: 'Full Name' },
      { key: 'email', label: 'Email' },
      { key: 'registrationType', label: 'Type' },
      { key: 'department', label: 'Department' },
      { key: 'institute', label: 'Institute' },
      { key: 'contactNo', label: 'Contact' },
      { key: 'rollNo', label: 'Roll No' },
      { key: 'stanTransactionId', label: 'Transaction ID' },
      { key: 'transactionDate', label: 'Transaction Date' },
      { key: 'totalAmountPaid', label: 'Amount Paid' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Submitted At' },
    ];
    const csv = toCSV(rows, columns);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="participant-registrations.csv"');
    res.send(csv);
  } catch (e) { next(e); }
};

// ── Paper Registrations ───────────────────────────────────────────────────────

const getPaper = async (_req, res, next) => {
  try {
    const data = await prisma.paperRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: { coAuthors: true },
    });
    res.json({ success: true, data });
  } catch (e) { next(e); }
};

const exportPaper = async (_req, res, next) => {
  try {
    const rows = await prisma.paperRegistration.findMany({
      orderBy: { createdAt: 'desc' },
      include: { coAuthors: true },
    });
    const columns = [
      { key: 'id', label: 'ID' },
      { key: 'authorName', label: 'Author Name' },
      { key: 'email', label: 'Email' },
      { key: 'registrationType', label: 'Type' },
      { key: 'paperId', label: 'Paper ID' },
      { key: 'paperTitle', label: 'Paper Title' },
      { key: 'department', label: 'Department' },
      { key: 'institution', label: 'Institution' },
      { key: 'contactNo', label: 'Contact' },
      { key: 'rollNo', label: 'Roll No' },
      { key: 'stanTransactionId', label: 'Transaction ID' },
      { key: 'transactionDate', label: 'Transaction Date' },
      { key: 'totalAmountPaid', label: 'Amount Paid' },
      { key: 'hasCoAuthors', label: 'Has Co-Authors' },
      { key: 'status', label: 'Status' },
      { key: 'createdAt', label: 'Submitted At' },
    ];
    const flatRows = rows.map((r) => ({
      ...r,
      hasCoAuthors: r.coAuthors?.length > 0 ? 'Yes' : 'No',
    }));
    const csv = toCSV(flatRows, columns);
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="paper-registrations.csv"');
    res.send(csv);
  } catch (e) { next(e); }
};

// ── Documents (private bucket) ───────────────────────────────────────────────

// Which columns hold document references, per registration kind.
const DOCUMENT_FIELDS = {
  workshop: { model: 'workshopRegistration', fields: ['resumeUrl'] },
  participant: { model: 'participantRegistration', fields: ['transactionReceipt', 'studentCard'] },
  paper: { model: 'paperRegistration', fields: ['transactionReceipt', 'studentCard'] },
  coauthor: { model: 'coAuthorRegistration', fields: ['transactionReceipt', 'studentCard'] },
};

// GET /api/admin/registrations/:kind/:id/file/:field → short-lived signed URL.
// Looks the path up from the DB row, so callers can't request arbitrary objects.
const getDocumentUrl = async (req, res, next) => {
  try {
    const { kind, id, field } = req.params;
    const spec = DOCUMENT_FIELDS[kind];
    if (!spec || !spec.fields.includes(field)) {
      return res.status(404).json({ success: false, message: 'Not found' });
    }
    const row = await prisma[spec.model].findUnique({ where: { id }, select: { [field]: true } });
    const objectPath = toPrivatePath(row?.[field]);
    if (!objectPath) {
      return res.status(404).json({ success: false, message: 'No file on record' });
    }
    console.log(`Document access: ${req.admin.email} → ${kind}/${id}/${field}`);
    res.json({ success: true, url: await createSignedUrl(objectPath) });
  } catch (e) { next(e); }
};

module.exports = { getWorkshop, exportWorkshop, getParticipant, exportParticipant, getPaper, exportPaper, getDocumentUrl };
