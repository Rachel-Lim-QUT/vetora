const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

const { expect } = chai;

const { createPatient, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const Patient = require('../models/Patient');
const PatientRepository = require('../repositories/PatientRepository');

chai.use(chaiHttp);
let server;
let port;

// createPatient
describe('createPatient Function Test', () => {

    it('should create a new patient successfully', async () => {

        // Mock Request Data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: {
                photo: '',
                name: 'Baby',
                age: '1 Month',
                gender: 'Female',
                species: 'Cat',
                breed: 'Domestic Short Hair',
                color: 'Calico',
                history: '',
                fname: 'Rachel',
                lname: 'Lim',
                phone: '0412345678',
                email: 'rachel.lim@example.com'
            }
        };

        // Mock Patient Created
        const createdPatient = { _id: new mongoose.Types.ObjectId(), ...req.body, userID: req.user.id };

        // Stub Patient.create to return createdPatient.
        const createStub = sinon.stub(Patient, 'create').resolves(createdPatient);

        // Mock Response Object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call createPatient function.
        await createPatient(req, res);

        // Assertions
        expect(createStub.calledOnceWith({ userID: req.user.id, ...req.body })).to.be.true;
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({
            photo: req.body.photo,
            name: req.body.name,
            age: req.body.age,
            gender: req.body.gender,
            species: req.body.species,
            breed: req.body.breed,
            color: req.body.color,
            history: req.body.history,
            fname: req.body.fname,
            lname: req.body.lname,
            phone: req.body.phone,
            email: req.body.email
        })).to.be.true;

        // Restore stubbed methods.
        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {

        // Stub Patient.create to throw an error.
        const createStub = sinon.stub(Patient, 'create').throws(new Error('500: Internal Server Error'));

        // Mock Request Data
        const req = {
            user: { id: new mongoose.Types.ObjectId() },
            body: {
                photo: '',
                name: 'Baby',
                age: '1 Month',
                gender: 'Female',
                species: 'Cat',
                breed: 'Domestic Short Hair',
                color: 'Calico',
                history: '',
                fname: 'Rachel',
                lname: 'Lim',
                phone: '0412345678',
                email: 'rachel.lim@example.com'
            }
        };

        // Mock Response Object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call createPatient function.
        await createPatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: '500: Internal Server Error' })).to.be.true;

        // Restore stubbed methods.
        createStub.restore();
    });
});

// getPatient
describe('getPatient Function Test', () => {

    it('should return patients for the given user', async () => {

        // Mock User ID
        const userID = new mongoose.Types.ObjectId();

        // Mock Patient Data
        const patients = [
            {
                _id: new mongoose.Types.ObjectId(),
                userID,
                photo: '',
                name: 'Baby',
                age: '1 Month',
                gender: 'Female',
                species: 'Cat',
                breed: 'Domestic Short Hair',
                color: 'Calico',
                history: '',
                fname: 'Rachel',
                lname: 'Lim',
                phone: '0412345678',
                email: 'rachel.lim@example.com'
            },

            {
                _id: new mongoose.Types.ObjectId(),
                userID,
                photo: '',
                name: 'Tibby',
                age: '5 Years',
                gender: 'Male',
                species: 'Dog',
                breed: 'Shih Tzu',
                color: 'Cream',
                history: '',
                fname: 'Persephone',
                lname: 'Raine',
                phone: '0487654321',
                email: 'persephone.raine@example.com'
            }
        ];

        // Stub PatientRepository.getPatient to return mock patients.
        const getPatientStub = sinon.stub(PatientRepository, 'getPatient').resolves(patients);

        // Mock Request & Response
        const req = { params: { id: userID } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call getPatient function.
        await getPatient(req, res);

        // Assertions
        expect(getPatientStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledWith(patients)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set.

        // Restore stubbed methods.
        getPatientStub.restore();
    });

    it('should return 500 if an error occurs', async () => {

        // Stub PatientRepository.getPatient to throw an error.
        const getPatientStub = sinon.stub(PatientRepository, 'getPatient').throws(new Error('500: Internal Server Error'));

        // Mock Request & Response
        const req = { params: { id: new mongoose.Types.ObjectId() } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call getPatient function.
        await getPatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: '500: Internal Server Error' })).to.be.true;

        // Restore stubbed methods.
        getPatientStub.restore();
    });
});

// updatePatient
describe('updatePatient Function Test', () => {

    it("should update a patient's details successfully", async () => {

        // Mock Patient Data
        const patientID = new mongoose.Types.ObjectId();
        const existingPatient = {
            _id: patientID,
            photo: '',
            name: 'Baby',
            age: '1 Month',
            gender: 'Female',
            species: 'Cat',
            breed: 'Domestic Short Hair',
            color: 'Calico',
            history: '',
            fname: 'Rachel',
            lname: 'Lim',
            phone: '0412345678',
            email: 'rachel.lim@example.com',
            save: sinon.stub().resolvesThis(), // Mock Save Method
        };

        // Stub PatientRepository.updatePatient to return mock patient.
        const updatePatientStub = sinon.stub(PatientRepository, 'updatePatient').callsFake(
            async (id, updates, userId) => {
                Object.assign(existingPatient, updates);
                return existingPatient;
            }
        );

        // Mock Request & Response
        const req = {
            params: { id: patientID },
            body: {
                photo: 'baby.png',
                history: 'Initial Visit: Healthy and vibing.',
            }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call updatePatient function.
        await updatePatient(req, res);

        // Assertions
        expect(existingPatient.photo).to.equal('baby.png');
        expect(existingPatient.history).to.equal('Initial Visit: Healthy and vibing.');
        expect(res.status.called).to.be.false; // No error status should be set.
        expect(res.json.calledOnce).to.be.true;

        // Restore Stubbed Methods
        updatePatientStub.restore();
    });

    it('should return 404 if patient is not found', async () => {
        // Stub PatientRepository.updatePatient to return null.
        const updatePatientStub = sinon.stub(PatientRepository, 'updatePatient').resolves(null);

        // Mock Request & Response
        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call updatePatient function.
        await updatePatient(req, res);

        // Assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: '404: Patient Not Found' })).to.be.true;

        // Restore stubbed methods.
        updatePatientStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub PatientRepository.updatePatient to throw an error.
        const updatePatientStub = sinon.stub(PatientRepository, 'updatePatient').throws(new Error('500: Internal Server Error'));

        // Mock Request & Response
        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call updatePatient function.
        await updatePatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        // Restore stubbed methods.
        updatePatientStub.restore();
    });
});

// deletePatient
describe('deletePatient Function Test', () => {

    it('should delete a patient successfully', async () => {
        // Mock Request Data
        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            user: { id: new mongoose.Types.ObjectId().toString() }
        };

        // Mock patient found in the database.
        const patient = { remove: sinon.stub().resolves() };

        // Stub PatientRepository.deletePatient to return the mock patient.
        const deletePatientStub = sinon.stub(PatientRepository, 'deletePatient').resolves(patient);

        // Mock Response Object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call deletePatient function.
        await deletePatient(req, res);

        // Assertions
        expect(deletePatientStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledWith({ message: 'Patient deleted' })).to.be.true;

        // Restore stubbed methods.
        deletePatientStub.restore();
    });

    it('should return 404 if patient is not found', async () => {
        // Stub PatientRepository.deletePatient to return null.
        const deletePatientStub = sinon.stub(PatientRepository, 'deletePatient').resolves(null);

        // Mock Request Data
        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            user: { id: new mongoose.Types.ObjectId().toString() }
        };

        // Mock Response Object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call deletePatient function.
        await deletePatient(req, res);

        // Assertions
        expect(deletePatientStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: '404: Patient Not Found' })).to.be.true;

        // Restore stubbed methods.
        deletePatientStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub PatientRepository.deletePatient to throw an error
        const deletePatientStub = sinon.stub(PatientRepository, 'deletePatient').throws(new Error('500: Internal Server Error'));

        // Mock Request Data
        const req = {
            params: { id: new mongoose.Types.ObjectId().toString() },
            user: { id: new mongoose.Types.ObjectId().toString() }
        };

        // Mock Response Object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call deletePatient function.
        await deletePatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: '500: Internal Server Error' })).to.be.true;

        // Restore stubbed methods.
        deletePatientStub.restore();
    });
});