const express = require('express');
const { createPatient, getPatient, getAllPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createPatient);
router.get('/', protect, getAllPatient);
router.get('/:id', protect, getPatient,);
router.put('/:id', protect, updatePatient);
router.delete('/:id', protect, deletePatient);

module.exports = router;