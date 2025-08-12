const express = require('express');
const { createPatient, getPatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createPatient);
router.route('/').get(protect, getPatient);

module.exports= router;