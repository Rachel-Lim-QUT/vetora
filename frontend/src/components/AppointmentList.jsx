const AppointmentList = ({ appointments, setEditingAppointment }) => {

    return (
        <div>
            {appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-window bg-gray-100 mb-4 p-6 shadow-md">
                    <p><b>Patient</b>: {appointment.patient}</p>
                    <p><b>Type</b>: {appointment.type}</p>
                    <p><b>Date</b>: {Date(appointment.date)}</p>

                    <div className="mt-2">
                        <button
                            className="pill-button bg-yellow-500 hover:bg-yellow-600 text-white mr-2 px-4 py-2 shadow"
                            onClick={() => setEditingAppointment(appointment)}  // 👈 اینجا باشه
                        >
                                 Edit
                        </button>

                        <button className="pill-button bg-red-500 hover:bg-red-600 text-white px-4 py-2 shadow">
                            Cancel
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default AppointmentList;