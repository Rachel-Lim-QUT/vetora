import { Schema, model } from 'mongoose';

const appointmentSchema = new Schema({
    userID: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    patient: { type: Schema.Types.ObjectId, ref: 'Patient', required: true },
    status: { type: String, required: true }, // Rachel's note: For example, Upcoming, In Progress, Complete, etc.
    date: { type: String, required: true },
    time: { type: String, required: true },
    type: { type: String, required: true },
    duration: { type: Number, required: true },
});

export default model('Appointment', appointmentSchema);