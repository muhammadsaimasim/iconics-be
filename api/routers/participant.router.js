const { Router } = require('express');
const { registrationUpload } = require('../middlewares/upload.middleware');
const { participantRules, ieeeCheckRules, validate } = require('../middlewares/validation.middleware');
const { registrationLimiter, ieeeCheckLimiter } = require('../middlewares/rateLimit.middleware');
const { register, checkIeee } = require('../controllers/participant.controller');

const router = Router();

// POST /api/register/participant — submit participant registration
// (Registrations are read only through the authenticated /api/admin/registrations/* routes.)
router.post('/', registrationLimiter, registrationUpload, participantRules, validate, register);

// GET /api/register/participant/check-ieee?number=xxx — check IEEE number uniqueness
router.get('/check-ieee', ieeeCheckLimiter, ieeeCheckRules, validate, checkIeee);

module.exports = router;
