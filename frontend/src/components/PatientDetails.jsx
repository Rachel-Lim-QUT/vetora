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
        <div className="grid grid-cols-5 gap-6 p-6">

            {/* left side (pfp) */}
            <div className="col-span-2 flex flex-col items-center">
                <img
                    src={patients.photo}
                    alt="patient pfp"
                    className="w-80 h-80 mb-6"
                />
                <h1 className="">{patients.name}</h1>
            </div>

            {/* right side (patient details) */}
            <div className="col-span-3 bg-gray-100 rounded shadow">
                <div key={patients._id}>

                    {/* row for columns */}
                    <div className="grid grid-cols-3 gap-6 p-6">
                        {/* column 1 */}
                        <div>
                            <p><b>Name</b>: {patients.name} {patients.lname}</p>
                            <p><b>Gender</b>: {patients.gender}</p>
                            <p><b>Breed</b>: {patients.breed}</p>
                        </div>

                        {/* column 2 */}
                        <div>
                            <p><b>Age</b>: {patients.age}</p>
                            <p><b>Species</b>: {patients.species}</p>
                            <p><b>Color</b>: {patients.color}</p>
                        </div>

                        {/* column 3 */}
                        <div>
                            <p><b>Owner</b>: {patients.fname}</p>
                            <p><b>Phone</b>: {patients.phone}</p>

                            {/* this button should take you to the owners profile page */}
                            <button
                                // onClick={() => handleDelete(patient._id)}
                                className="pill-button bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                View
                            </button>
                        </div>
                    </div>

                    {/* row for history */}
                    <div className="px-6">
                        <label for="history">History:</label>
                        <textarea
                            id="history"
                            name="history"
                            type="text"
                            className="h-80 w-full border rounded"
                        // value=formData.history
                        />
                    </div>

                    {/* row buttons */}
                    <div className="p-6">
                        <Link to=""
                            className="pill-button bg-yellow-500 text-white px-4 py-2 rounded">
                            Edit
                        </Link>
                        <button
                            onClick={() => handleDelete(patients._id)}
                            className="pill-button bg-red-500 text-white ml-2 px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
                {/* ))} */}
            </div>
        </div >
    );
};

export default PatientDetails;