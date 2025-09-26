import Navbar from "../components/Navbar";
import AppointmentForm from "../components/AppointmentForm";

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Appointments = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
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
            <div className="flex gap-4">
                <div className="flex-1 m-4">
                    <AppointmentForm
                        patients={patients}
                        setPatients={setPatients}
                        appointments={appointments}
                        setAppointments={setAppointments}
                        editingAppointment={editingAppointment}
                        setEditingAppointment={setEditingAppointment}
                    />
                </div>
                <div className="flex-1 m-4">
                    {/* Insert AppointmentList component here. */}
                </div>
            </div>
        </>
    );
};

export default Appointments;