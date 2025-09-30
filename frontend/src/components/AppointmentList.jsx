import { useState } from 'react';
import axiosInstance from '../axiosConfig';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const AppointmentList = ({ appointments, setEditingAppointment, setAppointments }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [showCompleteConfirm, setShowCompleteConfirm] = useState(null);

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

    const handleComplete = async (appointmentID) => {
        try {
            await axiosInstance.patch(`/api/appointments/${appointmentID}/complete`,
                { completed: true },
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            alert('Appointment completed');

            // update appointment in the list
            setAppointments(
                appointments.map(a =>
                    a._id === appointmentID ? { ...a, completed: true } : a
                )
            );

        } catch (error) {
            alert('Error: Could not mark appointment as completed');
        }
    };

    return (
        <div>
            {appointments.map((appointment) => (
                <div key={appointment._id} className="rounded-window bg-gray-100 mb-4 p-6 shadow-md">
                    <p><b>Patient</b>: {appointment.patient?.name} {appointment.patient?.lname}</p>
                    <p><b>Type</b>: {appointment.type}</p>
                    <p><b>Date</b>: {appointment.date}</p>

                    <div className="flex justify-between items-center gap-4 mt-2">
                        <div className="flex-1">
                            <button
                                className="pill-button-s-pink mr-4"
                                onClick={() => setEditingAppointment(appointment)} // 👈 اینجا باشه
                            >
                                Edit
                            </button>
                            <Link
                                to={`/patientprofile/${appointment.patient._id}`}
                                className="pill-button bg-yellow-500 text-white px-4 py-2 rounded"
                            >
                                View
                            </Link>
                        </div>

                        <div className="mt-2">
                            <button
                                type="button"
                                onClick={() => setShowConfirm(true)}
                                className="pill-button-s-red">
                                Cancel
                            </button>
                            <button
                                onClick={() => setShowCompleteConfirm(appointment._id)}
                                disabled={appointment.completed}
                                className={`px-4 py-2 shadow rounded ${appointment.completed ? 'bg-gray-500 text-white cursor-not-allowed' : 'bg-green-500 text-white hover:bg-green-600'}`}
                            >
                                {appointment.completed ? 'Completed' : 'Complete'}
                            </button>
                        </div>
                    </div>

                    {/* show complete */}
                    {showCompleteConfirm === appointment._id && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-4">
                                <p className="mb-4 font-medium text-lg">
                                    Are you sure you want to mark this appointment as complete?
                                </p>
                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => {
                                            handleComplete(appointment._id);
                                            setShowCompleteConfirm(null);
                                        }}
                                        className="px-4 py-2 bg-green-600 text-white rounded-full"
                                    >
                                        Yes
                                    </button>
                                    <button
                                        onClick={() => setShowCompleteConfirm(null)}
                                        className="px-4 py-2 bg-gray-300 rounded-full"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

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