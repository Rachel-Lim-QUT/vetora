
const chai = require('chai');
const chaiHttp = require('chai-http');
const http = require('http');
const app = require('../server');
const connectDB = require('../config/db');
const mongoose = require('mongoose');
const sinon = require('sinon');
const OwnerRepository = require('../repositories/OwnerRepository');
const { createOwner, getOwner, updateOwner, deleteOwner } = require('../controllers/ownerController');
const { expect } = chai;

chai.use(chaiHttp);
let server;
let port;

// create
describe('createOwner', () => {

    // restore stubbed methods - this fixes wrapped errors
    afterEach(() => {
        sinon.restore();
    });

    it('should create a new owner successfully', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { id: userId },
            body: {
                fname: 'meow',
                lname: 'meow',
                phone: '1234567890',
                email: 'meow@example.com'
            }
        };

        // mock create
        const createdOwner = { _id: new mongoose.Types.ObjectId(), ...req.body, userID: userId };
        sinon.stub(OwnerRepository, 'createOwner').resolves(createdOwner);

        // mock response
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await createOwner(req, res);

        // assertions
        expect(res.status.calledWith(201)).to.be.true;
        expect(res.json.calledWithMatch({
            _id: createdOwner._id,
            fname: createdOwner.fname,
            lname: createdOwner.lname,
            phone: createdOwner.phone,
            email: createdOwner.email
        })).to.be.true;
    });

    it('should return 500 if repository throws error', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { id: userId },
            body: {
                fname: 'meow',
                lname: 'meow',
                phone: '1234567890',
                email: 'meow@example.com'
            }
        };

        // stub create throw an error
        sinon.stub(OwnerRepository, 'createOwner').throws(new Error('DB Error'));

        // mock response
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await createOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });

    it('should return 500 if first name field is missing', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { id: userId },
            body: {
                lname: 'meow',
                phone: '1234567890',
                email: 'meow@example.com'
            }
        };

        // stub create throw an error
        sinon.stub(OwnerRepository, 'createOwner').throws(new Error('First name field is required'));

        // mock response
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await createOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'First name field is required' })).to.be.true;
    });

    it('should return 500 if last name field is missing', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { id: userId },
            body: {
                fname: 'meow',
                phone: '1234567890',
                email: 'meow@example.com'
            }
        };

        // stub to throw an error
        sinon.stub(OwnerRepository, 'createOwner').throws(new Error('Last name field is required'));

        // mock response
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await createOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Last name field is required' })).to.be.true;
    });

    it('should return 500 if phone field is missing', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const req = {
            user: { id: userId },
            body: {
                fname: 'meow',
                lname: 'meow',
                email: 'meow@example.com'
            }
        };

        // stub create throw an error
        sinon.stub(OwnerRepository, 'createOwner').throws(new Error('Phone field is required'));

        // mock response
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await createOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Phone field is required' })).to.be.true;
    });
});




// get
describe('getOwner', () => {

    // restore stubbed methods - this fixes wrapped errors
    afterEach(() => {
        sinon.restore();
    });

    it('should return owners for the given user', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const mockOwners = [
            {
                _id: new mongoose.Types.ObjectId(),
                fname: 'meow',
                lname: 'meow',
                phone: '1234567890',
                email: 'meow@example.com',
                userID: userId
            },
            {
                _id: new mongoose.Types.ObjectId(),
                fname: 'cat',
                lname: 'cat',
                phone: '0987654321',
                email: 'cat@example.com',
                userID: userId
            }
        ];

        // mock get
        sinon.stub(OwnerRepository, 'getOwner').resolves(mockOwners);

        // mock response
        const req = { user: { id: userId }, params: {} };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await getOwner(req, res);

        // assertions
        expect(res.json.calledWith(mockOwners)).to.be.true;

    });

    it('should return 500 if repository throws error', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();

        // stub get throw an error
        sinon.stub(OwnerRepository, 'getOwner').throws(new Error('DB Error'));

        // mock response
        const req = { user: { id: userId }, params: {} };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await getOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;

    });
});




// update
describe('updateOwner', () => {

    // restore stubbed methods - this fixes wrapped errors
    afterEach(() => {
        sinon.restore();
    });

    it('should update an owner successfully', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();
        const updated = {
            _id: ownerId,
            fname: 'meow',
            lname: 'test',
            phone: '6969696969',
            email: 'meow.test@example.com',
            userID: userId
        };

        // mock update
        sinon.stub(OwnerRepository, 'updateOwner').resolves(updated);

        // mock response
        const req = {
            params: { id: ownerId },
            user: { id: userId },
            body: {
                lname: 'test',
                email: 'meow.test@example.com'
            }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await updateOwner(req, res);

        // assertions
        // expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(updated)).to.be.true;
    });

    it('should return 200 with null if owner not found', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();

        /// mock update
        sinon.stub(OwnerRepository, 'updateOwner').resolves(null);

        // mock response
        const req = {
            params: { id: ownerId },
            user: { id: userId },
            body: { lname: 'test' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await updateOwner(req, res);

        // assertions
        expect(res.status.calledWith(404)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'Owner not found' })).to.be.true;
    });

    it('should return 500 if repository throws error', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();

        // stub update throw an error
        sinon.stub(OwnerRepository, 'updateOwner').throws(new Error('DB Error'));

        // mock response
        const req = {
            params: { id: ownerId },
            user: { id: userId },
            body: { lname: 'test' }
        };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await updateOwner(req, res);

        // assertion
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});




// delete
describe('deleteOwner', () => {

    // restore stubbed methods - this fixes wrapped errors
    afterEach(() => {
        sinon.restore();
    });

    it('should delete an owner successfully', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();
        const result = { message: 'Owner deleted' };

        // mock delete
        sinon.stub(OwnerRepository, 'deleteOwner').resolves(result);

        // mock response
        const req = { params: { id: ownerId }, user: { id: userId } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await deleteOwner(req, res);

        // assertions
        // expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(result)).to.be.true;
    });

    it('should return 200 with null if owner not found', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();

        // mock detele
        sinon.stub(OwnerRepository, 'deleteOwner').resolves(null);

        // mock response
        const req = { params: { id: ownerId }, user: { id: userId } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await deleteOwner(req, res);

        // assertion
        // expect(res.status.calledWith(200)).to.be.true;
        expect(res.json.calledWith(null)).to.be.true;
    });

    it('should return 500 if repository throws error', async () => {

        // mock request data
        const userId = new mongoose.Types.ObjectId();
        const ownerId = new mongoose.Types.ObjectId();

        // stub delete throw an error
        sinon.stub(OwnerRepository, 'deleteOwner').throws(new Error('DB Error'));

        // mock response
        const req = { params: { id: ownerId }, user: { id: userId } };
        const res = { status: sinon.stub().returnsThis(), json: sinon.spy() };

        // call function
        await deleteOwner(req, res);

        // assertions
        expect(res.status.calledWith(500)).to.be.true;
        expect(res.json.calledWithMatch({ message: 'DB Error' })).to.be.true;
    });
});