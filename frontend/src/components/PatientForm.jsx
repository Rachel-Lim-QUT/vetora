import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const PatientForm = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({ fname: '', lname: '', dob: '', gender: '', phone: '', email: '' });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post('/api/patients', formData, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Success! Patient file created.');
        } catch (error) {
            alert('Error: Patient file creation failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded mb-6">
            <h1 className="text-2xl font-bold mb-4">Create New Patient</h1>

            <label for="fname">First Name:</label>
            <input
                id="fname"
                name="fname"
                type="text"
                placeholder="Enter the patient's first name."
                value={formData.fname}
                onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <label for="lname">Last Name:</label>
            <input
                id="lname"
                name="lname"
                type="text"
                placeholder="Enter the patient's last name."
                value={formData.lname}
                onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <label for="dob">Date of Birth:</label>
            <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
                required
            />

            <label for="gender">Gender:</label>
            <select
                id="gender"
                name="gender"
                onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="" disabled selected>-- Select a gender. --</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
            </select>

            <label for="phone">Phone Number:</label>
            <input
                id="phone"
                name="phone"
                type="tel"
                maxLength={10}
                placeholder="Enter the patient's phone number."
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
            />

            <label for="email">Email Address:</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter the patient's email address."
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full mb-4 p-2 border rounded"
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded">
                Create
            </button>
        </form>
    );
};

export default PatientForm;