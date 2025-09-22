import { Link } from 'react-router-dom';
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const PatientList = ({ patients, setPatients, setEditingPatient }) => {
    const { user } = useAuth();

    return (
        <div className="bg-white mb-6 p-6 rounded shadow-md">
            <h1 className="font-bold text-2xl mb-4">Patient List</h1>
            {patients.map((patient) => (
                <div key={patient._id} className="bg-gray-100 mb-4 p-4 rounded shadow">

                    <p><b>Name</b>: {patient.name} {patient.lname}</p>
                    <p><b>Owner</b>: {patient.fname} {patient.lname}</p>
                    <p><b>Phone</b>: {patient.phone}</p>

                    <div className="mt-2">
                        <Link to={`/patientprofile/${patient._id}`}
                            className="pill-button bg-yellow-500 text-white px-4 py-2 rounded">
                            View
                        </Link>
                    </div>
                </div>
            ))
            }
        </div >
    );
};

export default PatientList;