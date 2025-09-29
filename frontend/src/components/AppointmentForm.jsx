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
        time: '',
    });

    useEffect(() => {
        if (editingAppointment) {
            const dateObject = new Date(editingAppointment.date);
            setFormData({
                patient: editingAppointment.patient,
                type: editingAppointment.type,
                date: dateObject.toISOString().slice(0, 10),
                time: dateObject.toTimeString().slice(0, 5),
            });

        } else {
            setFormData({
                patient: '',
                type: '',
                date: '',
                time: '',
            });
        }
    }, [editingAppointment]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // combine date and time
            const combinedDateTime = new Date(`${formData.date}T${formData.time}`);

            const payload = {
                patient: formData.patient,
                type: formData.type,
                date: combinedDateTime.toISOString(),
            };

            if (editingAppointment) {
                const response = await axiosInstance.put(`/api/appointments/${editingAppointment._id}`, payload, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });

                // update appointment
                setAppointments((prev) =>
                    prev.map((appointment) =>
                        appointment._id.toString() === response.data._id.toString() ? response.data : appointment
                    )
                );
            } else {
                const response = await axiosInstance.post('/api/appointments', payload, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAppointments((prev) => [...prev, response.data]);
            }

            // reset form
            setEditingAppointment(null);
            setFormData({
                patient: '',
                type: '',
                date: '',
                time: '',
            });
            alert('Success! Appointment saved.')
        } catch (error) {
            alert('Error: Unable to save appointment. Please try again.');
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
                <option value="" disabled selected>Select an appointment type</option>
                <option value="Health Check">Health Check</option>
                <option value="Microchipping">Microchipping</option>
                <option value="Surgery">Surgery</option>
                <option value="Vaccinations">Vaccinations</option>
            </select>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                <div>
                    <label htmlFor="date" className="required">Date</label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="rounded-input-field"
                        required
                    />
                </div>

                <div>
                    <label htmlFor="time" className="required">Time</label>
                    <input
                        id="time"
                        name="time"
                        type="time"
                        value={formData.time}
                        onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                        className="rounded-input-field"
                        required
                    />
                </div>
            </div>

            <button
                type="submit"
                className={editingAppointment ? "pill-button-l-green" : "pill-button-l-pink"}
            >
                {editingAppointment ? 'Update' : 'Create'}
            </button>

            {
                editingAppointment && (
                    <button
                        type="button"
                        onClick={() => {
                            setEditingAppointment(null);
                            setFormData({ patient: '', type: '', date: '', time: '' });
                        }}
                        className="pill-button-l-pink"
                    >
                        Cancel
                    </button>
                )
            }
        </form >
    );
};

export default AppointmentForm;