import Navbar from "../components/Navbar";
import AppointmentForm from "../components/AppointmentForm";
import AppointmentList from "../components/AppointmentList";

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
            <div className="flex">
                <div className="flex-1 ml-4 mt-4 mr-2">
                    <AppointmentForm
                        patients={patients}
                        setPatients={setPatients}
                        appointments={appointments}
                        setAppointments={setAppointments}
                        editingAppointment={editingAppointment}
                        setEditingAppointment={setEditingAppointment}
                    />
                </div>
                <div className="flex-1 ml-2 mt-4 mr-4">
                    <AppointmentList
                        appointments={appointments}
                        setAppointments={setAppointments}
                        editingAppointment={editingAppointment}
                        setEditingAppointment={setEditingAppointment}
                    />
                </div>
            </div>
        </>
    );
};

export default Appointments;