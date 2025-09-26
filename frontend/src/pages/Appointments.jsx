import Navbar from "../components/Navbar";
import AppointmentForm from "../components/AppointmentForm";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Appointments = () => {
    const { user } = useAuth();
    const [appointments, setAppointments] = useState([]);
    const [editingAppointment, setEditingAppointment] = useState(null);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                const response = await axiosInstance.get('/api/appointments/', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setAppointments(response.data);
            } catch (error) {
                alert('Error: Failed to fetch appointment.')
            }
        };
        if (user) fetchAppointments();
    }, [user]);

    return (
        <>
            <Navbar />
            <AppointmentForm
                appointments={appointments}
                setAppointments={setAppointments}
                editingAppointment={editingAppointment}
                setEditingAppointment={setEditingAppointment}
            />
        </>
    );
};

export default Appointments;