import { Link } from 'react-router-dom';

const PatientList = ({ patients }) => {

    return (
        <div>
            {patients.map((patient) => (
                <div key={patient._id} className="flex items-center rounded-window mb-4 p-4">

                    {/* left side (pfp) */}
                    <div className="mr-4">
                        <img
                            src={patient.photo}
                            alt="patient pfp"
                            className="w-32 h-32"
                        />
                    </div>

                    {/* right side (patient details) */}
                    <div className="flex-1">
                        <p><b>Name</b>: {patient.name} {patient.lname}</p>
                        <p><b>Owner</b>: {patient.fname} {patient.lname}</p>
                        <p><b>Phone</b>: {patient.phone}</p>

                        <div className="mt-2">
                            <Link
                                to={`/patientprofile/${patient._id}`}
                                className="pill-button-s-pink"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default PatientList;