const express = require('express');
const { createAppointment, getAppointment, updateAppointment, deleteAppointment, completeAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointment);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

// for complete button
router.patch('/:id/complete', protect, completeAppointment);

module.exports = router;
