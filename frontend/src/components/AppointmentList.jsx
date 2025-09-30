import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import Appointments from '../pages/Appointments';

const AppointmentList = ({ appointments, setEditingAppointment, setAppointments }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);

    const handleDelete = async (appointmentID) => {
        try {
            await axiosInstance.delete(`/api/appointments/${appointmentID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });

            alert('Success! Appoointment deleted.');

            // update appointment list
            setAppointments(appointments.filter((a) => a._id !== appointmentID));

        } catch (error) {
            alert('Error: Appointment deletion failed. Please try again.');
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div>
            {appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-window bg-gray-100 mb-4 p-6 shadow-md">
                    <p><b>Patient</b>: {appointment.patient}</p>
                    <p><b>Type</b>: {appointment.type}</p>
                    <p><b>Date</b>: {appointment.date}</p>

                    <div className="mt-2">
                        <button
                            className="pill-button-s-pink mr-4"
                            onClick={() => setEditingAppointment(appointment)} // 👈 اینجا باشه
                        >
                            Edit
                        </button>

                        <button
                            type="button"
                            onClick={() => setShowConfirm(true)}
                            className="pill-button-s-red">
                            Cancel
                        </button>
                    </div>

                    {/* show confirm */}
                    {showConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="popup-box">
                                <p className="mb-4 font-medium text-lg">
                                    Are you sure you want to cancel the appointment??
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => handleDelete(appointment._id)}
                                        className="pill-button-s-red"
                                    >
                                        Yes
                                    </button>

                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="pill-button-s-pink"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AppointmentList;