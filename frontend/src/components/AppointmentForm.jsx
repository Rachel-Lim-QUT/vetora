import '../App.css';

import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const AppointmentForm = ({ appointments, setAppointments, editingAppointment, setEditingAppointment }) => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [formData, setFormData] = useState({
        patient: '',
        type: '',
        date: '',
        time: '',
    });

    // fetch patients
    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get('/api/patients', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPatients(response.data);
            } catch (error) {
                console.error('Error fetching patients:', error);
                alert('Error fetching patient list.');
            }
        };

        if (user) {
            fetchPatients();
        }
    }, [user]);

    useEffect(() => {
        if (editingAppointment) {
            const appointmentDate = new Date(editingAppointment.date);
            setFormData({
                patient: editingAppointment.patient,
                type: editingAppointment.type,
                date: appointmentDate.toISOString().slice(0, 10),
                time: appointmentDate.toTimeString().slice(0, 5),
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
                setAppointments(appointments.map((appointment) => (appointment._id === response.data._id ? response.data : appointment)));
            } else {
                const response = await axiosInstance.post('/api/appointments', payload, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAppointments([...appointments, response.data]);
            }
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
        } finally {
            // Refreshes the appointment list after creating or updating an appointment.
            const response = await axiosInstance.get('/api/appointments', { headers: { Authorization: `Bearer ${user.token}` }, });
            setAppointments(response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-window bg-gray-100 mb-6 p-6 shadow-md">
            <h1 className="text-2xl font-bold mb-4">{editingAppointment ? 'Update Appointment' : 'Create New Appointment'}</h1>

            {/* patient */}
            <label htmlFor="patient" className="required">Patient</label>
            <select
                id="patient"
                name="patient"
                value={formData.patient}
                onChange={(e) => setFormData({ ...formData, patient: e.target.value })}
                className="rounded-input-field mb-4"
                required
                disabled={editingAppointment}
            >
                <option value="" disabled>Select a patient</option>
                {patients.map((patient) => (
                    <option key={patient._id} value={patient._id}>
                        {patient.name} ({patient.species})
                    </option>
                ))}
            </select>

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

            {/* Date and time*/}
            {/* <label for="date" className="required">Date</label>
            <input
                id="date"
                name="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="rounded-input-field mb-4"
                required
            /> */}
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

            {editingAppointment && (
                <button
                    type="button"
                    onClick={() => {
                        setEditingAppointment(null);
                        setFormData({ patient: '', type: '', date: '' });
                    }}
                    className="pill-button-l-grey"
                >
                    Cancel
                </button>
            )}
        </form>
    );
};

export default AppointmentForm;