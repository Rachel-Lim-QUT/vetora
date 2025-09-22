import Navbar from '../components/Navbar';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import PatientDetails from "../components/PatientDetails"; // change to deatiled patient view

const PatientProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get(`/api/patients/${id}`, { // added ${id} and changed ' to `
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
            <PatientDetails
                patients={patients}
            />
        </>
    );
};

export default PatientProfile;