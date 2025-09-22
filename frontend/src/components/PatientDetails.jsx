import { Link } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const PatientDetails = ({ patients, setPatients, setEditingPatient }) => {
    const { user } = useAuth();

    const handleDelete = async (patientID) => {
        try {
            await axiosInstance.delete(`/api/patients/${patientID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Success! Patient deleted.')
            setPatients(patients.filter((patient) => patient._id !== patientID));
        } catch (error) {
            alert('Error: Failed to delete patient.')
        }
    };

    return (
        <div className="bg-white mb-6 p-6 rounded shadow-md">
            <h1 className="font-bold text-2xl mb-4">Patient List</h1>
            {patients.map((patient) => (
                <div key={patient._id} className="bg-gray-100 mb-4 p-4 rounded shadow">

                    <p><b>Name</b>: {patient.name} {patient.lname}</p>
                    <p><b>Owner</b>: {patient.fname} {patient.lname}</p>
                    <p><b>Phone</b>: {patient.phone}</p>

                    <div className="mt-2">
                        <Link to="/patientprofile"
                            className="bg-yellow-500 text-white px-4 py-2 rounded">
                            View
                        </Link>
                        <button
                            onClick={() => handleDelete(patient._id)}
                            className="bg-red-500 text-white ml-2 px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default PatientDetails;