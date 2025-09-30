const Owner = require('../models/Owner');

class OwnerRepository {

  // create a new owner
  async createOwner(ownerData) {
    try {
      const owner = await Owner.create(ownerData);
      return owner;
    } catch (error) {
      throw new Error(`Failed to create owner: ${error.message}`);
    }
  }

  // get owner by id
  async getOwner(id) {
    try {
      const owner = await Owner.findById(id);
      if (!owner) throw new Error('Owner not found');
      return owner;
    } catch (error) {
      throw new Error(`Failed to get owner: ${error.message}`);
    }
  }

  // get all owners
  async getAllOwners() {
    try {
      const owners = await Owner.find();
      return owners;
    } catch (error) {
      throw new Error(`Failed to get all owners: ${error.message}`);
    }
  }

  // update owner
  async updateOwner(id, updates) {
    try {
      const updatedOwner = await Owner.findByIdAndUpdate(
        id,
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updatedOwner) throw new Error('Owner not found');
      return updatedOwner;
    } catch (error) {
      throw new Error(`Failed to update owner: ${error.message}`);
    }
  }

  // delete owner
  async deleteOwner(id) {
    try {
      const deletedOwner = await Owner.findByIdAndDelete(id);
      if (!deletedOwner) throw new Error('Owner not found');
      return { message: 'Owner deleted' };
    } catch (error) {
      throw new Error(`Failed to delete owner: ${error.message}`);
    }
  }
}

module.exports = new OwnerRepository();