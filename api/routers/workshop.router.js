const { Router } = require('express');
const { workshopUpload } = require('../middlewares/upload.middleware');
const { workshopRules, validate } = require('../middlewares/validation.middleware');
const { registrationLimiter } = require('../middlewares/rateLimit.middleware');
const { register } = require('../controllers/workshop.controller');

const router = Router();

// POST /api/register/workshop — submit workshop registration
// (Registrations are read only through the authenticated /api/admin/registrations/* routes.)
router.post('/', registrationLimiter, workshopUpload, workshopRules, validate, register);

module.exports = router;
