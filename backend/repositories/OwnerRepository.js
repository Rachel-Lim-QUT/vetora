const BaseRepository = require('../classes/repositoryClass');
const Owner = require('../models/Owner');

class OwnerRepository extends BaseRepository {
    constructor() {
        super(Owner);
    }

    // create a new owner
    async createOwner(ownerData) {
        try {
            return await this.create(ownerData);
        } catch (error) {
            throw new Error(`Failed to create owner: ${error.message}`);
        }
    }

    // get owner by id
    async getOwner(id) {
        try {
            const owner = await this.model.findById(id).populate('patients');
            if (!owner) throw new Error('Owner not found');
            return owner;
        } catch (error) {
            throw new Error(`Failed to get owner: ${error.message}`);
        }
    }

    // get all owners
    async getAllOwners() {
        try {
            return await this.model.find().populate('patients');
        } catch (error) {
            throw new Error(`Failed to get all owners: ${error.message}`);
        }
    }

    // update owner
    async updateOwner(id, updates) {
        try {
            const updatedOwner = await this.model.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            ).populate('patients');

            if (!updatedOwner) throw new Error('Owner not found');
            return updatedOwner;
        } catch (error) {
            throw new Error(`Failed to update owner: ${error.message}`);
        }
    }

    // delete owner
    async deleteOwner(id) {
        try {
            const deletedOwner = await this.delete(id);
            if (!deletedOwner) throw new Error('Owner not found');
            return { message: 'Owner deleted' };
        } catch (error) {
            throw new Error(`Failed to delete owner: ${error.message}`);
        }
    }
}

module.exports = new OwnerRepository();