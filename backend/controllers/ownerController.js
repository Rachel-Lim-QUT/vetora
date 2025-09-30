const OwnerRepository = require('../repositories/OwnerRepository');
const Logger = require('../services/logger');

// create owner
const createOwner = async (req, res) => {
    const { fname, lname, phone, email } = req.body;

    try {
        const ownerData = { fname, lname, phone, email };
        const owner = await OwnerRepository.createOwner(ownerData);

        Logger.log(`Owner created: id ${owner._id} by user ${req.user.id}`);

        res.status(201).json(owner);
    } catch (error) {
        Logger.error(`Error creating owner: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// get owner
const getOwner = async (req, res) => {
    try {
        const owner = await OwnerRepository.getOwner(req.params.id);

        if (!owner) return res.status(404).json({ message: 'Owner not found' });

        Logger.log(`Fetched owner id ${req.params.id}`);

        res.json(owner);
    } catch (error) {
        Logger.error(`Error fetching owner ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// get all owners
const getAllOwners = async (req, res) => {
    try {
        const owners = await OwnerRepository.getAllOwners();

        Logger.log(`Fetched all owners, total: ${owners.length}`);

        res.json(owners);
    } catch (error) {
        Logger.error(`Error fetching all owners: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// update owner
const updateOwner = async (req, res) => {
    try {
        const allowed = ['fname', 'lname', 'phone', 'email'];
        const updates = {};
        allowed.forEach(k => { if (k in req.body) updates[k] = req.body[k]; });

        const ownerId = req.params.id;
        const updated = await OwnerRepository.updateOwner(ownerId, updates);

        if (!updated) return res.status(404).json({ message: 'Owner not found' });

        Logger.log(`Owner updated: id ${ownerId} by user ${req.user.id}`);

        res.json(updated);
    } catch (error) {
        Logger.error(`Error updating owner ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Delete owner
const deleteOwner = async (req, res) => {
    try {
        const ownerId = req.params.id;
        const result = await OwnerRepository.deleteOwner(ownerId);

        Logger.log(`Owner deleted: id ${ownerId} by user ${req.user.id}`);

        res.json(result);
    } catch (error) {
        Logger.error(`Error deleting owner ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createOwner, getOwner, getAllOwners, updateOwner, deleteOwner };
