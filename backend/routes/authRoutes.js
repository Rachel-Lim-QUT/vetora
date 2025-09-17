const express = require('express');
const { registerUser, loginUser, getUser, updateUser, deleteUser } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/profile', protect, getUser);
router.put('/profile', protect, updateUser);
router.delete('/profile', protect, deleteUser);

module.exports = router;