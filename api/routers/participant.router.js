const { Router } = require('express');
const { registrationUpload } = require('../middlewares/upload.middleware');
const { participantRules, validate } = require('../middlewares/validation.middleware');
const { register, getAll, getById, checkIeee } = require('../controllers/participant.controller');

const router = Router();

// POST /api/register/participant — submit participant registration
router.post('/', registrationUpload, participantRules, validate, register);

// GET /api/register/participant/check-ieee?number=xxx — check IEEE number uniqueness
router.get('/check-ieee', checkIeee);

// GET /api/register/participant — list all registrations
router.get('/', getAll);

// GET /api/register/participant/:id — get single registration
router.get('/:id', getById);

module.exports = router;
