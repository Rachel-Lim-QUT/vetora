import { Router } from 'express';
import { createAppointment } from '../controllers/appointmentController';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/', protect, createAppointment);

module.exports = router;