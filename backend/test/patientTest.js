const sinon = require('sinon');
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');

const { expect } = chai;

const Patient = require('../models/Patient');
const { createPatient, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
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

        // Stub Patient.create to return the createdPatient
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

        // Stub Patient.create to throw an error
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
            { _id: new mongoose.Types.ObjectId(), userID, photo: '', name: 'Baby', age: '1 Month', gender: 'Female', species: 'Cat', breed: 'Domestic Short Hair', color: 'Calico', history: '' },
            { _id: new mongoose.Types.ObjectId(), userID, photo: '', name: 'Tibby', age: '5 Years', gender: 'Male', species: 'Dog', breed: 'Shih Tzu', color: 'Cream', history: '' }
        ];

        // Stub Patient.find to return mock patients.
        const findStub = sinon.stub(PatientRepository, 'getPatient').resolves(patients);

        // Mock Request & Response
        const req = { params: { id: userID } };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call getPatient function
        await getPatient(req, res);

        // Assertions
        expect(findStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.json.calledWith(patients)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set.

        // Restore Stubbed methods
        findStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Patient.find to throw an error
        const findStub = sinon.stub(PatientRepository, 'getPatient').throws(new Error('500: Internal Server Error'));

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
        findStub.restore();
    });
});

// updatePatient
describe('Update Function Test', () => {

    it('should update task successfully', async () => {
        // Mock task data
        const taskId = new mongoose.Types.ObjectId();
        const existingTask = {
            _id: taskId,
            title: "Old Task",
            description: "Old Description",
            completed: false,
            deadline: new Date(),
            save: sinon.stub().resolvesThis(), // Mock save method
        };
        // Stub Task.findById to return mock task
        const findByIdStub = sinon.stub(Task, 'findById').resolves(existingTask);

        // Mock request & response
        const req = {
            params: { id: taskId },
            body: { title: "New Task", completed: true }
        };
        const res = {
            json: sinon.spy(),
            status: sinon.stub().returnsThis()
        };

        // Call function
        await updateTask(req, res);

        // Assertions
        expect(existingTask.title).to.equal("New Task");
        expect(existingTask.completed).to.equal(true);
        expect(res.status.called).to.be.false; // No error status should be set
        expect(res.json.calledOnce).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 404 if task is not found', async () => {
        const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateTask(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 on error', async () => {
        const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        await updateTask(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        findByIdStub.restore();
    });
});

// deletePatient
describe('DeleteTask Function Test', () => {

    it('should delete a task successfully', async () => {
        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock task found in the database
        const task = { remove: sinon.stub().resolves() };

        // Stub Task.findById to return the mock task
        const findByIdStub = sinon.stub(Task, 'findById').resolves(task);

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(task.remove.calledOnce).to.be.true;
        expect(res.json.calledWith({ message: 'Task deleted' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 404 if task is not found', async () => {
        // Stub Task.findById to return null
        const findByIdStub = sinon.stub(Task, 'findById').resolves(null);

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(findByIdStub.calledOnceWith(req.params.id)).to.be.true;
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Task not found' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Task.findById to throw an error
        const findByIdStub = sinon.stub(Task, 'findById').throws(new Error('DB Error'));

        // Mock request data
        const req = { params: { id: new mongoose.Types.ObjectId().toString() } };

        // Mock response object
        const res = {
            status: sinon.stub().returnsThis(),
            json: sinon.spy()
        };

        // Call function
        await deleteTask(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods
        findByIdStub.restore();
    });

});