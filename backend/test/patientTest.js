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

        // Call createPatient Function
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

        // Restore Stubbed Methods
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

        // Call createPatient Function
        await createPatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: '500: Internal Server Error' })).to.be.true;

        // Restore Stubbed Methods
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

        // Call getPatient function
        await getPatient(req, res);

        // Assertions
        expect(getPatientStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledWith(patients)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set.

        // Restore Stubbed methods
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

        // Call getPatient function
        await getPatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: '500: Internal Server Error' })).to.be.true;

        // Restore Stubbed Methods
        getPatientStub.restore();
    });
});

// updatePatient (WIP)
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

        // Call updatePatient Function
        await updatePatient(req, res);

        // Assertions
        expect(existingPatient.photo).to.equal('baby.png');
        expect(existingPatient.history).to.equal('Initial Visit: Healthy and vibing.');
        expect(res.status.called).to.be.false; // No error status should be set.
        expect(res.json.calledOnce).to.be.true;

        // Restore Stubbed Methods
        updatePatientStub.restore();
    });

    // it('should return 404 if the patient is not found', async () => {
    //     const findByIdStub = sinon.stub(PatientRepository, 'updatePatient').resolves(null);

    //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    //     const res = {
    //         status: sinon.stub().returnsThis(),
    //         json: sinon.spy()
    //     };

    //     await updatePatient(req, res);

    //     expect(res.status.calledWith(404)).to.be.true;
    //     expect(res.json.calledWith({ message: '404: Patient Not Found' })).to.be.true;

    //     findByIdStub.restore();
    // });

    // it('should return 500 on error', async () => {
    //     const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

    //     const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
    //     const res = {
    //         status: sinon.stub().returnsThis(),
    //         json: sinon.spy()
    //     };

    //     await updateTask(req, res);

    //     expect(res.status.calledWith(500)).to.be.true;
    //     expect(res.json.called).to.be.true;

    //     findByIdStub.restore();
    // });
});

// deletePatient (WIP)
// describe('deletePatient Function Test', () => {

//     it('should delete a patient successfully', async () => {
//         // Mock Request Data
//         const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//         // Mock Patient found in the database
//         const patient = { remove: sinon.stub().resolves() };

//         // Stub PatientRepository.deletePatient to return the mock task
//         const findByIdStub = sinon.stub(PatientRepository, 'deletePatient').resolves(patient);

//         // Mock Response Object
//         const res = {
//             status: sinon.stub().returnsThis(),
//             json: sinon.spy()
//         };

//         // Call deletePatient Function
//         await deletePatient(req, res);

//         // Assertions
//         expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//         expect(patient.remove.calledOnce).to.be.true;
//         expect(res.json.calledWith({ message: 'Patient deleted' })).to.be.true;

//         // Restore Stubbed Methods
//         findByIdStub.restore();
//     });

//     it('should return 404 if task is not found', async () => {
//         // Stub Task.findById to return null
//         const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

//         // Mock request data
//         const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//         // Mock response object
//         const res = {
//             status: sinon.stub().returnsThis(),
//             json: sinon.spy()
//         };

//         // Call function
//         await deleteTask(req, res);

//         // Assertions
//         expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
//         expect(res.status.calledWith(404)).to.be.true;
//         expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

//         // Restore stubbed methods
//         findByIdStub.restore();
//     });

//     it('should return 500 if an error occurs', async () => {
//         // Stub Task.findById to throw an error
//         const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

//         // Mock request data
//         const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

//         // Mock response object
//         const res = {
//             status: sinon.stub().returnsThis(),
//             json: sinon.spy()
//         };

//         // Call function
//         await deleteTask(req, res);

//         // Assertions
//         expect(res.status.calledWith(500)).to.be.true;
//         expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

//         // Restore stubbed methods
//         findByIdStub.restore();
//     });
// });