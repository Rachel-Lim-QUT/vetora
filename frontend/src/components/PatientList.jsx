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
                alert('Error: Failed to fetch patient.')
            }
        };
        if (user) fetchPatients();
    }, [user]);

    return (
        <div className="bg-white mb-6 p-6 rounded shadow-md">
            <h1 className="font-bold mb-4 text-2xl">Patient List</h1>
            {patients.map((patient) => (
                <div key={patient._id} className="bg-gray-100 mb-4 p-4 rounded shadow">
                    <p><b>Name</b>: {patient.lname}, {patient.fname}</p>
                    <p><b>Date of Birth</b>: {patient.dob}</p>
                    <p><b>Gender</b>: {patient.gender}</p>
                    <p><b>Phone</b>: {patient.phone}</p>
                    <p><b>Email Address</b>: {patient.email}</p>
                </div>
            ))}
        </div>
    );
};

export default PatientList;