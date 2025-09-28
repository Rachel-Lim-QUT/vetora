const express = require('express');
const { createAppointment, getAppointment, updateAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/', protect, getAppointment);
router.put('/:id', protect, updateAppointment);

module.exports = router;