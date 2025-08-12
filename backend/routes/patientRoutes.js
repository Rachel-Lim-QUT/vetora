const express = require('express');
const { createPatient, getPatient, updatePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.route('/').post(protect, createPatient);
router.route('/').get(protect, getPatient);
router.route('/').put(protect, updatePatient);

module.exports= router;