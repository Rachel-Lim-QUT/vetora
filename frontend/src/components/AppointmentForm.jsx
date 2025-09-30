import '../App.css';

import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const AppointmentForm = ({ appointments, setAppointments, editingAppointment, setEditingAppointment }) => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        patient: '',
        type: '',
        date: '',
    });

    useEffect(() => {
        if (editingAppointment) {
            setFormData({
                patient: editingAppointment.patient,
                type: editingAppointment.type,
                date: editingAppointment.date
                    ? new Date(editingAppointment.date).toISOString().slice(0, 10)
                    : '',
            });
        } else {
            setFormData({
                patient: '',
                type: '',
                date: '',
            });
        }
    }, [editingAppointment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingAppointment) {
                const response = await axiosInstance.put(`/api/appointments/${editingAppointment._id}`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAppointments(appointments.map((appointment) => (appointment._id === response.data._id ? response.data : appointment)));
            } else {
                const response = await axiosInstance.post('/api/appointments', formData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAppointments([...appointments, response.data]);
            }
            setEditingAppointment(null);
            setFormData({
                patient: '',
                type: '',
                date: '',
            });
            alert('Success! Appointment saved.')
        } catch (error) {
            alert('Error: Unable to save appointment. Please try again.');
        } finally {
            // Refreshes the appointment list after creating or updating an appointment.
            const response = await axiosInstance.get('/api/appointments', { headers: { Authorization: `Bearer ${user.token}` }, });
            setAppointments(response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-window bg-gray-100 mb-6 p-6 shadow-md">
            <h1 className="text-2xl font-bold mb-4">{editingAppointment ? 'Update Appointment' : 'Create New Appointment'}</h1>

            {/* Patient */}
            <label for="patient" className="required">Patient</label>
            <input
                id="patient"
                name="patient"
                type="text"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                className="rounded-input-field mb-4"
                required
            />

            {/* Appointment Type */}
            <label for="type" className="required">Appointment Type</label>
            <select
                id="type"
                name="type"
                type="text"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="rounded-input-field mb-4"
                required
            >
                <option value="" disabled selected>-- Select an appointment type --</option>
                <option value="Health Check">Health Check</option>
                <option value="Microchipping">Microchipping</option>
                <option value="Surgery">Surgery</option>
                <option value="Vaccinations">Vaccinations</option>
            </select>

            {/* Date */}
            <label for="date" className="required">Date</label>
            <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="rounded-input-field mb-4"
                required
            />

            <button
                type="submit"
                className={editingAppointment ? "pill-button-l-green" : "pill-button-l-pink"}
            >
                {editingAppointment ? 'Update' : 'Create'}
            </button>

            {editingAppointment && (
                <button
                    type="button"
                    onClick={() => {
                        setEditingAppointment(null);
                        setFormData({ patient: '', type: '', date: '' });
                    }}
                    className="pill-button bg-gray-500 hover:bg-gray-600 text-white p-2 w-full mt-2"
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default AppointmentForm;