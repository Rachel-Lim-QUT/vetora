const PatientRepository = require('../repositories/PatientRepository');
const Logger = require('../services/logger');

// Create Patient
const createPatient = async (req, res) => {
    const {
        photo,
        name,
        age,
        gender,
        species,
        breed,
        color,
        history,
        fname,
        lname,
        phone,
        email
    } = req.body;

    try {
        const patientData = ({
            userID: req.user.id,
            photo,
            name,
            age,
            gender,
            species,
            breed,
            color,
            history,
            fname,
            lname,
            phone,
            email
        });

        const patient = await PatientRepository.createPatient(patientData);

        Logger.log(`Patient created: id ${patient._id} by user ${req.user.id}`);

        res.status(201).json({
            photo: patient.photo,
            name: patient.name,
            age: patient.age,
            gender: patient.gender,
            species: patient.species,
            breed: patient.breed,
            color: patient.color,
            history: patient.history,
            fname: patient.fname,
            lname: patient.lname,
            phone: patient.phone,
            email: patient.email,
        });
    } catch (error) {
        Logger.error(`Error creating patient: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Get Patient
const getPatient = async (req, res) => {
    try {
        const patients = await PatientRepository.getPatient(req.params.id);

        Logger.log(`Fetched patient id ${req.params.id}`);

        res.json(patients);
    } catch (error) {
        Logger.error(`Error fetching patient ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message })
    }
};

// get all patient
const getAllPatient = async (req, res) => {
    try {
        const patients = await PatientRepository.getAllPatients();

        Logger.log(`Fetched all patients, total: ${patients.length}`);

        res.json(patients);
    } catch (error) {
        Logger.error(`Error fetching all patients: ${error.message}`);
        res.status(500).json({ message: error.message })
    }
};

// Update Patient
const updatePatient = async (req, res) => {
    try {
        const allowed = [
            'photo',
            'name',
            'age',
            'gender',
            'species',
            'breed',
            'color',
            'history',
            'fname',
            'lname',
            'phone',
            'email'
        ];
        const updates = {};
        allowed.forEach(k => { if (k in req.body) updates[k] = req.body[k]; });

        const patientId = req.params.id;
        const updated = await PatientRepository.updatePatient(
            patientId,
            updates,
            req.user?.id
        );

        if (!updated) return res.status(404).json({ message: 'Patient not found' });

        Logger.log(`Patient updated: id ${patientId} by user ${req.user.id}`);

        res.json(updated); // for front
    } catch (error) {
        Logger.error(`Error updating patient ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

// Delete Patient
const deletePatient = async (req, res) => {
    try {
        const patientId = req.params.id;
        const result = await PatientRepository.deletePatient(patientId);

        Logger.log(`Patient deleted: id ${patientId} by user ${req.user.id}`);

        res.json(result);
    } catch (error) {
        Logger.error(`Error deleting patient ${req.params.id}: ${error.message}`);
        res.status(500).json({ message: error.message });
    }
};

module.exports = { createPatient, getPatient, getAllPatient, updatePatient, deletePatient };