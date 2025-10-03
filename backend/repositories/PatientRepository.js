const BaseRepository = require('../classes/repositoryClass');
const Patient = require('../models/Patient');

class PatientRepository extends BaseRepository {
    constructor() {
        super(Patient);
    }

    // create a new patient
    async createPatient(patientData) {
        try {
            return await this.create(patientData);
        } catch (error) {
            throw new Error(`Failed to create patient: ${error.message}`);
        }
    }

    // get patient
    async getPatient(id) {
        try {
            const patient = await this.getById(id);
            if (!patient) throw new Error('Patient not found');
            return patient;
        } catch (error) {
            throw new Error(`Failed to get patient: ${error.message}`);
        }
    }

    // get all patients
    async getAllPatients() {
        try {
            return await this.getAll();
        } catch (error) {
            throw new Error(`Failed to get all patients: ${error.message}`);
        }
    }

    // get all patients by id
    async getPatientsByUserId(userId) {
        try {
            return await this.model.find({ userID: userId }).select('_id name');
        } catch (error) {
            throw new Error(`Failed to get patients: ${error.message}`);
        }
    }

    // update
    async updatePatient(id, updates, userId = null) {
        try {
            const query = userId ? { _id: id, userID: userId } : { _id: id };
            const updatedPatient = await this.update(id, updates, query);
            if (!updatedPatient) throw new Error('Patient not found');
            return updatedPatient;
        } catch (error) {
            throw new Error(`Failed to update patient: ${error.message}`);
        }
    }

    // delete 
    async deletePatient(id) {
        try {
            const deletedPatient = await this.delete(id);
            if (!deletedPatient) throw new Error('Patient not found');
            return { message: 'Patient deleted' };
        } catch (error) {
            throw new Error(`Failed to delete patient: ${error.message}`);
        }
    }
}

module.exports = new PatientRepository();