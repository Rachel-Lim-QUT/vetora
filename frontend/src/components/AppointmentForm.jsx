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
                date: editingAppointment.date,
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
        } catch (error) {
            alert('Error: Unable to save appointment. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-window bg-white mb-6 p-6 shadow-md">
            <h1 className="text-2xl font-bold mb-4">{editingAppointment ? 'Update Appointment' : 'Create New Appointment'}</h1>

            {/* Patient */}
            <label for="patient" className="required">Patient</label>
            <input
                id="patient"
                name="patient"
                type="text"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
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
                className="mb-4 p-2 w-full border rounded"
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
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <button type="submit" className="pill-button bg-blue-600 hover:bg-blue-700 text-white p-2 w-full">
                {editingAppointment ? 'Update' : 'Create'}
            </button>
        </form>
    );
};

export default AppointmentForm;