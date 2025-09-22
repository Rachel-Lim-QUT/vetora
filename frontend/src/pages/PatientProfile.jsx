import Navbar from '../components/Navbar';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import PatientDetails from "../components/PatientDetails"; // change to deatiled patient view

const PatientProfile = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);
    const [editingPatient, setEditingPatient] = useState(null);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get('/api/patients/', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPatients(response.data);
            } catch (error) {
                alert('Error: Failed to fetch patient.')
            }
        };
        if (user) fetchPatients();
    }, [user]);

    return (
        <>
            <Navbar />

            <div className="col-span-3">
                <PatientDetails
                    patients={patients}

                />
            </div>
        </>

    );
};


export default PatientProfile;