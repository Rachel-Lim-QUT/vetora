const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server'); 
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const Patient = require('../models/Patient');
const { createPatient, getPatient, updatePatient, deletePatient } = require('../controllers/patientController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

describe('createPatient Function Test', () => {

    it('should create a new patient successfully', async () => {
        // Mock Request Data
        const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { fname: "Test", lname: "Test", dob: "2000-02-02", gender: "Other", phone: "0400000000", email: "test@example.com" }
        };

        // Mock patient that would be created.
        const createdPatient = { _id: new mongoose.Types.ObjectId(), ...req.body, userID: req.user.id };

        // Stub Patient.create to return the createdPatient.
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
        expect(res.json.calledWith(createdPatient)).to.be.true;

        // Restore stubbed methods.
        createStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Patient.create to throw an error.
        const createStub = sinon.stub(Patient, 'create').throws(new Error('DB Error'));

        // Mock Request Data
        const req = {
        user: { id: new mongoose.Types.ObjectId() },
        body: { fname: "Test", lname: "Test", dob: "2000-02-02", gender: "Other", phone: "0400000000", email: "test@example.com" }
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
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods.
        createStub.restore();
    });
});

describe('updatePatient Function Test', () => {

    it('should update patient details successfully', async () => {
        // Mock Patient Data
        const patientID = new mongoose.Types.ObjectId();
        const existingPatient = {
            _id: patientID,
            fname: "Test",
            lname: "Test",
            dob: new Date(),
            gender: "Other",
            phone: "0400000000",
            email: "test@example.com",
            save: sinon.stub().resolvesThis(), // Mock Save Method
        };

        // Stub Patient.findById to return mock task.
        const findByIdStub = sinon.stub(Patient, 'findById').resolves(existingPatient);

        // Mock Request & Response
        const req = {
        params: { id: patientID },
        body: { fname: "New", lname: "New" }
        };
        const res = {
        json: sinon.spy(), 
        status: sinon.stub().returnsThis()
        };

        // Call updatePatient function.
        await updatePatient(req, res);

        // Assertions
        expect(existingPatient.fname).to.equal("New");
        expect(existingPatient.lname).to.equal("New");
        expect(res.status.called).to.be.false; // No error status should be set.
        expect(res.json.calledOnce).to.be.true;

        // Restore stubbed methods.
        findByIdStub.restore();
    });

    it('should return 404 if patient is not found', async () => {
        const findByIdStub = sinon.stub(Patient, 'findById').resolves(null);

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await updatePatient(req, res);

        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWith({ message: 'Error 404: Patient not found.' })).to.be.true;

        findByIdStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        const findByIdStub = sinon.stub(Patient, 'findById').throws(new Error('DB Error'));

        const req = { params: { id: new mongoose.Types.ObjectId() }, body: {} };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        await updatePatient(req, res);

        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.called).to.be.true;

        findByIdStub.restore();
    });
});

describe('getPatient Function Test', () => {

    it('should return patients for the given user', async () => {
        // Mock User ID
        const userID = new mongoose.Types.ObjectId();

        // Mock Patient Data
        const patients = [
        { _id: new mongoose.Types.ObjectId(), fname: "Test", lname: "One", dob: "2001-01-01", userID },
        { _id: new mongoose.Types.ObjectId(), fname: "Test", lname: "Two", dob: "2002-02-02", userID }
        ];

        // Stub Patient.find to return mock patients.
        const findStub = sinon.stub(Patient, 'find').resolves(patients);

        // Mock Request & Response
        const req = { user: { id: userID } };
        const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
        };

        // Call getPatient function.
        await getPatient(req, res);

        // Assertions
        expect(findStub.calledOnceWith({ userID })).to.be.true;
        expect(res.json.calledWith(patients)).to.be.true;
        expect(res.status.called).to.be.false; // No error status should be set.

        // Restore stubbed methods.
        findStub.restore();
    });

    it('should return 500 if an error occurs', async () => {
        // Stub Patient.find to throw an error.
        const findStub = sinon.stub(Patient, 'find').throws(new Error('DB Error'));

        // Mock Request & Response
        const req = { user: { id: new mongoose.Types.ObjectId() } };
        const res = {
        json: sinon.spy(),
        status: sinon.stub().returnsThis()
        };

        // Call getPatient function.
        await getPatient(req, res);

        // Assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

        // Restore stubbed methods.
        findStub.restore();
    });
});

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