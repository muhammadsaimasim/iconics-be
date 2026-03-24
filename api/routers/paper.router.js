const { Router } = require('express');
const { registrationUpload } = require('../middlewares/upload.middleware');
const { paperRules, validate } = require('../middlewares/validation.middleware');
const { register, addCoAuthor, getAll, getById } = require('../controllers/paper.controller');

const router = Router();

// POST /api/register/paper — submit paper registration
router.post('/', registrationUpload, paperRules, validate, register);

// POST /api/register/paper/:id/coauthor — add co-author to existing paper registration
router.post('/:id/coauthor', registrationUpload, validate, addCoAuthor);

// GET /api/register/paper — list all registrations
router.get('/', getAll);

// GET /api/register/paper/:id — get single registration with co-authors
router.get('/:id', getById);

module.exports = router;
