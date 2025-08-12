const PatientList = ({ patients, setEditingPatient }) => {
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
                    
                    <div className="mt-2">
                        <button
                            onClick={() => setEditingPatient(patient)}
                            className="bg-yellow-500 text-white px-4 py-2 rounded"
                        >
                            Edit
                        </button>
                        <button
                            className="bg-red-500 text-white ml-2 px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PatientList;