const BaseRepository = require('../classes/repositoryClass');
const Appointment = require('../models/Appointment');

class AppointmentRepository extends BaseRepository {
    constructor() {
        super(Appointment);
    }

    // create
    async createAppointment(appointmentData) {
        try {
            const appointment = await this.create(appointmentData);

            return await appointment.populate('patient');
        } catch (error) {
            throw new Error(`Failed to create appointment: ${error.message}`);
        }
    }

    // get
    async getAppointments(userId) {
        try {
            return await this.model.find({ userID: userId }).populate('patient');
        } catch (error) {
            throw new Error(`Failed to get appointments: ${error.message}`);
        }
    }

    // update
    async updateAppointment(appointmentId, userId, updates) {
        try {
            const updatedAppointment = await this.model.findOneAndUpdate(
                { _id: appointmentId, userID: userId },
                { $set: updates },
                { new: true, runValidators: true }
            ).populate('patient');

            if (!updatedAppointment) {
                throw new Error('Appointment not found or not permitted');
            }

            return updatedAppointment;
        } catch (error) {
            throw new Error(`Failed to update appointment: ${error.message}`);
        }
    }

    //delete
    async deleteAppointment(appointmentId, userId) {
        try {
            const deletedAppointment = await this.model.findOneAndDelete({
                _id: appointmentId, userID: userId
            });

            if (!deletedAppointment) {
                throw new Error('Appointment not found or not permitted');
            }

            return { message: 'Appointment cancelled successfully' };
        } catch (error) {
            throw new Error(`Failed to cancel appointment: ${error.message}`);
        }
    }
}

module.exports = new AppointmentRepository();