import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const PatientList = () => {
    const { user } = useAuth();
    const [patients, setPatients] = useState([]);

    useEffect(() => {
        const fetchPatients = async () => {
            try {
                const response = await axiosInstance.get('/api/patients/', {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPatients(response.data);
            } catch (error) {
                alert('Failed to fetch patient.')
            }
        };
        if (user) fetchPatients();
    }, [user]);
}

export default PatientList;