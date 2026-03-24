const { Router } = require('express');
const { workshopUpload } = require('../middlewares/upload.middleware');
const { workshopRules, validate } = require('../middlewares/validation.middleware');
const { register, getAll, getById } = require('../controllers/workshop.controller');

const router = Router();

// POST /api/register/workshop — submit workshop registration
router.post('/', workshopUpload, workshopRules, validate, register);

// GET /api/register/workshop — list all registrations
router.get('/', getAll);

// GET /api/register/workshop/:id — get single registration
router.get('/:id', getById);

module.exports = router;
