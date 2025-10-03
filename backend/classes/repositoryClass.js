class BaseRepository {
    constructor(model) {
        this.model = model;
    }

    // create
    async create(data) {
        return this.model.create(data);
    }

    // get
    async getById(id) {
        return this.model.findById(id);
    }

    // get all
    async getAll(filter = {}) {
        return this.model.find(filter);
    }

    // update
    async update(id, updates, extraFilter = {}) {
        return this.model.findOneAndUpdate(
            { _id: id, ...extraFilter },
            { $set: updates },
            { new: true, runValidators: true }
        );
    }

    // delete
    async delete(id) {
        return this.model.findByIdAndDelete(id);
    }
}

module.exports = { BaseRepository };