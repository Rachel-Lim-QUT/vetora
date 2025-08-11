const express = require('express');
const { createPatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createPatient);

module.exports= router;