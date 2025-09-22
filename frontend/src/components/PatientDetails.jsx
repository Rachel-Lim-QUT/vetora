import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const PatientDetails = ({ patients, setPatients, setEditingPatient }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();

    const handleDelete = async (patientID) => {
        try {
            await axiosInstance.delete(`/api/patients/${patientID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Success! Patient deleted.')
            navigate('/patients');
            // setPatients(patients.filter((patient) => patient._id !== patientID));
        } catch (error) {
            alert('Error: Failed to delete patient.')
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div>
            {/* {patients.map((patient) => ( */}
            <div key={patients._id}>

                {/* row for columns */}
                <div className="grid grid-cols-3 gap-6 p-6">
                    {/* column 1 */}
                    <div className="bg-gray-100 mb-4 p-4 rounded shadow">
                        <p><b>Name</b>: {patients.name} {patients.lname}</p>
                        <p><b>Gender</b>: {patients.gender}</p>
                        <p><b>Breed</b>: {patients.breed}</p>
                    </div>

                    {/* column 2 */}
                    <div className="bg-gray-100 mb-4 p-4 rounded shadow">
                        <p><b>Age</b>: {patients.age}</p>
                        <p><b>Species</b>: {patients.species}</p>
                        <p><b>Color</b>: {patients.color}</p>
                    </div>

                    {/* column 3 */}
                    <div className="bg-gray-100 mb-4 p-4 rounded shadow">
                        <p><b>Owner</b>: {patients.fname}</p>
                        <p><b>Phone</b>: {patients.phone}</p>

                        {/* this button should take you to the owners profile page */}
                        <button
                            // onClick={() => handleDelete(patient._id)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            View
                        </button>
                    </div>
                </div>

                <div className="mt-2 p-6">
                    <label for="history">History:</label>
                    <textarea
                        id="history"
                        name="history"
                        type="text"
                        className="h-80 mb-4 p-2 w-full border rounded"
                    // value={formData.history}
                    />
                </div>

                {/* row for buttons */}
                <div className="mt-2 p-6">
                    <Link to=""
                        className="pill-button bg-yellow-500 text-white px-4 py-2 rounded">
                        Edit
                    </Link>
                    <button
                        // onClick={() => handleDelete(patients._id)}
                        onClick={() => setShowConfirm(true)}
                        className="pill-button bg-red-500 text-white ml-2 px-4 py-2 rounded"
                    >
                        Delete
                    </button>
                </div>
            </div>

            {/* show confirm */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-4">
                        <p className="mb-4 font-medium text-lg">
                            Are you sure you want to delete patient profile?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(patients._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-full"
                            >
                                Yes
                            </button>

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded-full"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )
            }
        </div>
    );
};

export default PatientDetails;