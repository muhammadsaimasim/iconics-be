const { Router } = require('express');
const { registrationUpload } = require('../middlewares/upload.middleware');
const { paperRules, parseCoAuthors, validate } = require('../middlewares/validation.middleware');
const { registrationLimiter } = require('../middlewares/rateLimit.middleware');
const { register } = require('../controllers/paper.controller');

const router = Router();

// POST /api/register/paper — submit paper registration (co-authors included in the same request)
// (Registrations are read only through the authenticated /api/admin/registrations/* routes.
// The old unauthenticated POST /:id/coauthor route was unused by the site and has been removed.)
router.post('/', registrationLimiter, registrationUpload, parseCoAuthors, paperRules, validate, register);

module.exports = router;
