const express = require('express');
const router = express.Router();
const { verifyAdmin } = require('../middlewares/auth.middleware');
const authController = require('../controllers/admin/auth.controller');
const speakerController = require('../controllers/admin/speaker.controller');
const workshopController = require('../controllers/admin/workshop.controller');
const dateController = require('../controllers/admin/date.controller');
const trackController = require('../controllers/admin/track.controller');
const registrationController = require('../controllers/admin/registration.controller');
const committeeController = require('../controllers/admin/committee.controller');
const settingsController = require('../controllers/admin/settings.controller');
const cfpController = require('../controllers/admin/cfp.controller');
const multer = require('multer');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

// ── Auth ─────────────────────────────────────────────────────────────────────
router.post('/login', authController.login);

// All routes below require admin JWT
router.use(verifyAdmin);

// ── Speakers ─────────────────────────────────────────────────────────────────
router.get('/speakers', speakerController.getAll);
router.post('/speakers', upload.single('photo'), speakerController.create);
router.put('/speakers/:id', upload.single('photo'), speakerController.update);
router.delete('/speakers/:id', speakerController.remove);

// ── Workshops ─────────────────────────────────────────────────────────────────
router.get('/workshops', workshopController.getAll);
router.post('/workshops', upload.single('posterImage'), workshopController.create);
router.put('/workshops/:id', upload.single('posterImage'), workshopController.update);
router.delete('/workshops/:id', workshopController.remove);

// Workshop Sessions (nested)
router.get('/workshops/:workshopId/sessions', workshopController.getSessions);
router.post('/workshops/:workshopId/sessions', upload.single('instructorPhoto'), workshopController.createSession);
router.put('/workshops/:workshopId/sessions/:sessionId', upload.single('instructorPhoto'), workshopController.updateSession);
router.delete('/workshops/:workshopId/sessions/:sessionId', workshopController.removeSession);

// ── Important Dates ───────────────────────────────────────────────────────────
router.get('/dates', dateController.getAll);
router.post('/dates', dateController.create);
router.put('/dates/:id', dateController.update);
router.delete('/dates/:id', dateController.remove);

// ── Tracks ────────────────────────────────────────────────────────────────────
router.get('/tracks', trackController.getAll);
router.post('/tracks', trackController.create);
router.put('/tracks/:id', trackController.update);
router.delete('/tracks/:id', trackController.remove);

// Track topics (nested)
router.post('/tracks/:trackId/topics', trackController.addTopic);
router.put('/tracks/:trackId/topics/:topicId', trackController.updateTopic);
router.delete('/tracks/:trackId/topics/:topicId', trackController.removeTopic);

// ── Committee Members ─────────────────────────────────────────────────────────
router.get('/committee', committeeController.getAll);
router.post('/committee', committeeController.create);
router.put('/committee/:id', committeeController.update);
router.delete('/committee/:id', committeeController.remove);

// ── Site Settings ─────────────────────────────────────────────────────────────
router.get('/settings', settingsController.getAll);
router.put('/settings', settingsController.upsert);

// ── CFP Assets (poster + PDF guidelines) ─────────────────────────────────────
const cfpUpload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 20 * 1024 * 1024 } });
router.put('/cfp-assets', cfpUpload.fields([
  { name: 'poster', maxCount: 1 },
  { name: 'authorGuidelines', maxCount: 1 },
  { name: 'reviewerGuidelines', maxCount: 1 },
]), cfpController.upsertCfpAssets);

// ── Registrations (read + CSV export) ────────────────────────────────────────
router.get('/registrations/workshop', registrationController.getWorkshop);
router.get('/registrations/workshop/export', registrationController.exportWorkshop);
router.get('/registrations/participant', registrationController.getParticipant);
router.get('/registrations/participant/export', registrationController.exportParticipant);
router.get('/registrations/paper', registrationController.getPaper);
router.get('/registrations/paper/export', registrationController.exportPaper);

module.exports = router;
