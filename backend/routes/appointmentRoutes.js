const express = require('express');
const { createAppointment, getAppointment, getAppointmentById, updateAppointment, deleteAppointment, completeAppointment, transition } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointment);
router.get('/:id', protect, getAppointmentById);
router.put('/:id', protect, updateAppointment);
router.delete('/:id', protect, deleteAppointment);

// GH: Generic state transition: { action: "start" | "complete" | "cancel" | "confirm" }
router.post('/:id/transition', protect, transition);

// for complete button
router.patch('/:id/complete', protect, completeAppointment);

module.exports = router;
