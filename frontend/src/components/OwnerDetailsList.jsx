import { Link } from 'react-router-dom';

const OwnerDetailsList = ({ owners, patients = [], handleRemovePatient }) => {

    return (
        <div>
            {patients.map((patient) => (
                <div
                    key={patient._id}
                    className="flex items-center rounded-window mb-4 p-4">

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
                        <p><b>Name:</b> {patient.name}</p>

                        <div className="mt-2">
                            <Link
                                to={`/patientprofile/${patient._id}`}
                                className="pill-button-s-pink"
                            >
                                View
                            </Link>

                            <button
                                // onClick={() => handleRemovePatient(patient._id)}
                                className="pill-button-s-red"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OwnerDetailsList;