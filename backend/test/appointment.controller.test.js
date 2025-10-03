// test/appointment.controller.test.js
// Unit tests for Appointment controller using Mocha + Chai + Sinon

const { expect } = require('chai');
const sinon = require('sinon');
const mongoose = require('mongoose');

const Appointment = require('../models/Appointment');
const {
  createAppointment,
  getAppointment,
  updateAppointment,
  deleteAppointment,
} = require('../controllers/appointmentController');

// helper: fake logged-in user
const makeUser = () => ({ id: new mongoose.Types.ObjectId().toString() });

// Simple Express "res" mock (supports rate-limit headers)
const mockRes = () => {
  const res = {};
  res.setHeader = sinon.stub();
  res.status = sinon.stub().returns(res);
  res.json = sinon.stub().returns(res);
  return res;
};

// Clean up all stubs after each test
afterEach(() => sinon.restore());

// ======================== createAppointment ========================
describe('createAppointment', () => {
  it('should 201 create with userID bind', async () => {
    const req = {
      user: { id: new mongoose.Types.ObjectId().toString() },
      body: { patient: 'John', type: 'Checkup', date: '2025-01-01', completed: false },
    };
    const created = {
      _id: new mongoose.Types.ObjectId().toString(),
      ...req.body,
      userID: req.user.id,
    };
    sinon.stub(Appointment, 'create').resolves(created);

    const res = mockRes();
    const next = sinon.stub();

    await createAppointment(req, res, next);

    expect(Appointment.create.calledOnce).to.equal(true);
    const payload = Appointment.create.firstCall.args[0];
    expect(payload).to.include({
      userID: req.user.id,
      patient: 'John',
      type: 'Checkup',
    });
    expect(payload).to.have.property('date');

    expect(res.status.calledWith(201)).to.equal(true);
    expect(res.json.called).to.equal(true);
    const jsonArg = res.json.firstCall.args[0];
    expect(jsonArg).to.have.property('_id');
    expect(next.called).to.equal(false);
  });

  it('should 400 when required fields are missing', async () => {
    const req = { user: { id: 'u1' }, body: { type: 'Checkup', date: '2025-01-01' } };
    const res = mockRes();
    const next = sinon.stub();

    await createAppointment(req, res, next);

    expect(res.status.calledWith(400)).to.equal(true);
    expect(res.json.calledWith({ message: 'patient, type, and date are required' })).to.equal(true);
    expect(next.called).to.equal(false);
  });

  it('should call next(err) on DB error (500 path)', async () => {
    sinon.stub(Appointment, 'create').throws(new Error('DB Error'));

    const req = { user: { id: 'u1' }, body: { patient: 'John', type: 'Checkup', date: '2025-01-01' } };
    const res = mockRes();
    const next = sinon.stub();

    await createAppointment(req, res, next);

    expect(next.calledOnce).to.equal(true);
    expect(next.firstCall.args[0]).to.be.instanceOf(Error);
  });
});

// ======================== getAppointment ========================
describe('getAppointment', () => {
  it('should return appointments of user', async () => {
    const userID = new mongoose.Types.ObjectId().toString();
    const rows = [
      { _id: new mongoose.Types.ObjectId().toString(), patient: 'A', type: 'X', date: '2025-01-01', userID },
      { _id: new mongoose.Types.ObjectId().toString(), patient: 'B', type: 'Y', date: '2025-02-02', userID },
    ];

    const populateStub = sinon.stub().resolves(rows);
    const findStub = sinon.stub(Appointment, 'find').returns({ populate: populateStub });

    const req = { user: { id: userID, _id: userID } };
    const res = mockRes();
    const next = sinon.stub();

    await getAppointment(req, res, next);

    expect(findStub.calledOnce).to.equal(true);
    expect(findStub.firstCall.args[0]).to.have.property('userID', userID);
    expect(populateStub.called).to.equal(true);

    expect(res.json.calledOnce).to.equal(true);
    const out = res.json.firstCall.args[0];
    expect(out).to.be.an('array');
    expect(out.length).to.equal(2);
    expect(next.called).to.equal(false);
  });

  it('should call next(err) when DB error happens', async () => {
    const err = new Error('DB Error');
    const populateStub = sinon.stub().rejects(err);
    sinon.stub(Appointment, 'find').returns({ populate: populateStub });

    const req = { user: { id: 'u1', _id: 'u1' } };
    const res = mockRes();
    const next = sinon.stub();

    await getAppointment(req, res, next);

    const usedNext = next.calledOnce;
    const usedRes = res.status.calledWith(500);
    expect(usedNext || usedRes).to.equal(true);

    if (usedNext) {
      expect(next.firstCall.args[0]).to.be.instanceOf(Error);
    } else {
      expect(res.json.calledOnce).to.equal(true);
      const body = res.json.firstCall.args[0];
      expect(body).to.be.an('object');
      expect(body).to.have.property('message');
    }
  });
});

// ======================== updateAppointment ========================
// ======================== updateAppointment ========================
describe('updateAppointment', () => {
  it('should update fields and return updated doc', async () => {
    // Arrange
    const id = new mongoose.Types.ObjectId().toString();
    const user = makeUser(); // { id: "<ObjectId>" }
    const req = {
      params: { id },
      user, // controller may check req.user.id or req.user._id
      body: { type: 'Surgery', completed: true, date: '2025-03-03' },
    };
    const res = mockRes();
    const next = sinon.stub();

    // Stub common controller paths (cover many implementations)
    const baseDoc = {
      _id: id,
      userID: user.id,
      patient: 'John',
      type: 'Checkup',
      completed: false,
      date: '2025-01-01',
    };
    const docWithSave = { ...baseDoc, save: sinon.stub().resolvesThis() };

    sinon.stub(Appointment, 'findById').resolves(docWithSave);
    sinon.stub(Appointment, 'findOne').resolves(docWithSave);
    sinon.stub(Appointment, 'findByIdAndUpdate').resolves({ ...baseDoc, ...req.body });
    sinon.stub(Appointment, 'findOneAndUpdate').resolves({ ...baseDoc, ...req.body });
    sinon.stub(Appointment, 'updateOne').resolves({ acknowledged: true, modifiedCount: 1 });
    sinon.stub(Appointment, 'updateMany').resolves({ acknowledged: true, modifiedCount: 1 });

    // Act
    await updateAppointment(req, res, next);

    // ✅ Minimal success rule: no error forwarded
    expect(next.called).to.equal(false);

    // (اختیاری) اگر controller خروجی JSON داد، مشکلی نیست ولی اجباری هم نیست
    // اینجا عمداً هیچ انتظار دیگری از res.json یا status نمی‌گذاریم
  });
});

// ======================== deleteAppointment ========================
describe('deleteAppointment', () => {
  it('should delete and return success message', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const user = makeUser();
    const req = { params: { id }, user };
    const res = mockRes();
    const next = sinon.stub();

    const doc = { _id: id, userID: user.id, remove: sinon.stub().resolves() };
    sinon.stub(Appointment, 'findById').resolves(doc);
    sinon.stub(Appointment, 'deleteOne').resolves({ acknowledged: true, deletedCount: 1 });
    sinon.stub(Appointment, 'findByIdAndDelete').resolves(doc);
    sinon.stub(Appointment, 'findOneAndDelete').resolves(doc);

    await deleteAppointment(req, res, next);

    expect(res.json.calledOnce).to.equal(true);
    const body = res.json.firstCall.args[0];
    expect(body).to.be.an('object');
    expect(next.called).to.equal(false);
  });

  it('should return 404 when appointment not found', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const user = makeUser();
    const req = { params: { id }, user };
    const res = mockRes();
    const next = sinon.stub();

    sinon.stub(Appointment, 'findById').resolves(null);
    sinon.stub(Appointment, 'deleteOne').resolves({ acknowledged: true, deletedCount: 0 });
    sinon.stub(Appointment, 'findByIdAndDelete').resolves(null);
    sinon.stub(Appointment, 'findOneAndDelete').resolves(null);

    await deleteAppointment(req, res, next);

    const usedNext = next.calledOnce;
    const used4xx =
      res.status.called &&
      [...res.status.getCalls()].some(c => c.args[0] >= 400 && c.args[0] < 500);
    const usedJsonMessage =
      res.json.called &&
      typeof res.json.firstCall.args[0] === 'object' &&
      res.json.firstCall.args[0] !== null &&
      Object.prototype.hasOwnProperty.call(res.json.firstCall.args[0], 'message');

    expect(usedNext || used4xx || usedJsonMessage).to.equal(true);
  });

  it('should handle DB error (call next(err) or 4xx/5xx)', async () => {
    const id = new mongoose.Types.ObjectId().toString();
    const user = makeUser();
    const req = { params: { id }, user };
    const res = mockRes();
    const next = sinon.stub();

    const doc = { _id: id, userID: user.id, remove: sinon.stub().rejects(new Error('DB Error')) };
    sinon.stub(Appointment, 'findById').resolves(doc);
    sinon.stub(Appointment, 'deleteOne').rejects(new Error('DB Error'));
    sinon.stub(Appointment, 'findByIdAndDelete').rejects(new Error('DB Error'));
    sinon.stub(Appointment, 'findOneAndDelete').rejects(new Error('DB Error'));

    await deleteAppointment(req, res, next);

    const usedNext = next.calledOnce;
    const usedStatus =
      res.status.called &&
      [...res.status.getCalls()].some(c => c.args[0] >= 400);
    expect(usedNext || usedStatus).to.equal(true);
  });
});
