const express = require('express');
const { createOwner, getOwner, getAllOwners, addPatientToOwner, removePatientFromOwner, updateOwner, deleteOwner } = require('../controllers/ownerController');
const { protect } = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/', protect, createOwner);
router.get('/', protect, getAllOwners);
router.get('/:id', protect, getOwner,);
router.put('/:id', protect, updateOwner);
router.delete('/:id', protect, deleteOwner);

module.exports = router;