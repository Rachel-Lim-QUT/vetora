import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";

const Patients = () => {
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
        <div className="grid grid-cols-5 gap-6 p-6">
            <div className="col-span-2">
                <PatientForm
                    patients={patients}
                    setPatients={setPatients}
                    editingPatient={editingPatient}
                    setEditingPatient={setEditingPatient}
                />
            </div>
            <div className="col-span-3">
                <PatientList
                    patients={patients}
                    setPatients={setPatients}
                    setEditingPatient={setEditingPatient}
                />
            </div>
        </div>
    );
};

export default Patients;