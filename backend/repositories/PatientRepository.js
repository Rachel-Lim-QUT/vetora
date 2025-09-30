const Patient = require('../models/Patient');

class PatientRepository {

  // create a new patient
  async createPatient(patientData) {
    try {
      const patient = await Patient.create(patientData);
      return patient
    } catch (error) {
      throw new Error(`Failed to create patient: ${error.message}`);
    }
  }

  // get patient
  async getPatient(id) {
    try {
      const patient = await Patient.findById(id);
      if (!patient) throw new Error('Patient not found');
      return patient;
    } catch (error) {
      throw new Error(`Failed to get patient: ${error.message}`);
    }
  }

  // get all patients
  async getAllPatients() {
    try {
      const patients = await Patient.find();
      return patients;
    } catch (error) {
      throw new Error(`Failed to get all patients: ${error.message}`);
    }
  }

  // get all patients by id
  async getPatientsByUserId(userId) {
    try {
      const patients = await Patient.find({ userID: userId }).select('_id name');
      return patients;
    } catch (error) {
      throw new Error(`Failed to get patients: ${error.message}`);
    }
  }

  // update
  async updatePatient(id, updates, userId = null) {
    try {
      const query = userId ? { _id: id, userID: userId } : { _id: id };
      const updatedPatient = await Patient.findOneAndUpdate(
        query,
        { $set: updates },
        { new: true, runValidators: true }
      );
      if (!updatedPatient) throw new Error('Patient not found');
      return updatedPatient;
    } catch (error) {
      throw new Error(`Failed to update patient: ${error.message}`);
    }
  }

  // delete 
  async deletePatient(id) {
    try {
      const deletedPatient = await Patient.findByIdAndDelete(id)
      if (!deletedPatient) throw new Error('Patient not found');
      return { message: 'Patient deleted' };
    } catch (error) {
      throw new Error(`Failed to delete patient: ${error.message}`);
    }
  }
}

module.exports = new PatientRepository();