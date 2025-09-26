const express = require('express');
const { createAppointment, getAppointment } = require('../controllers/appointmentController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, createAppointment);
router.get('/:id', protect, getAppointment);

module.exports = router;