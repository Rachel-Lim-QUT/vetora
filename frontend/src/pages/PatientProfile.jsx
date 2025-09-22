import Navbar from '../components/Navbar';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import PatientDetails from "../components/PatientDetails"; // change to deatiled patient view

import patientpfp from '../images/temp-patient-pfp.gif';

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
            {/* left side */}
            <div className="grid grid-cols-5 gap-6 p-6">
                <div className="col-span-2">
                    <img
                        src={patientpfp}
                        alt="patient pfp"
                        className="w-80 h-80 mb-6"
                    />
                </div>

                {/* right side */}
                <div className="col-span-3">
                    <PatientDetails
                        patients={patients}

                    />
                </div>
            </div>
        </>
    );
};


export default PatientProfile;