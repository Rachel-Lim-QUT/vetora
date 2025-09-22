import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

import amore from '../images/amore.gif';
import coolcat from '../images/coolcat.png';
import chatting from '../images/chatting.gif';

const PatientForm = ({ patients, setPatients, editingPatient, setEditingPatient }) => {
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        photo: '',
        name: '',
        age: '',
        gender: '',
        species: '',
        breed: '',
        color: '',
        fname: '',
        lname: '',
        phone: '',
        email: ''
    });

    const pfps = [
        { name: 'amore', src: amore },
        { name: 'coolcat', src: coolcat },
        { name: 'chatting', src: chatting }
    ]

    const selectIcon = (src) => {
        setFormData({ ...formData, photo: src })
        console.log(src)
    }

    useEffect(() => {
        if (editingPatient) {
            setFormData({
                fname: editingPatient.fname,
                lname: editingPatient.lname,
                dob: editingPatient.dob,
                gender: editingPatient.gender,
                phone: editingPatient.phone,
                email: editingPatient.email,
            });
        } else {
            setFormData({ fname: '', lname: '', dob: '', gender: '', phone: '', email: '' });
        }
    }, [editingPatient]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingPatient) {
                const response = await axiosInstance.put(`/api/patients/${editingPatient._id}`, formData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPatients(patients.map((patient) => (patient._id === response.data._id ? response.data : patient)));
            } else {
                const response = await axiosInstance.post('/api/patients', formData, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setPatients([...patients, response.data]);
            }
            setEditingPatient(null);
            setFormData({ fname: '', lname: '', dob: '', gender: '', phone: '', email: '' });
            alert('Success! Patient file saved.')

            // refreshing the patient list after creating profile
            const response = await axiosInstance.get('/api/patients', {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            setPatients(response.data);

        } catch (error) {
            alert('Error: Patient file save failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white mb-6 p-6 rounded shadow-md">
            <h1 className="font-bold text-2xl mb-4">{editingPatient ? 'Update Patient Details' : 'Create New Patient'}</h1>

            <label for="photo">Select an icon:</label>
            <ul className="flex gap-4 my-4">
                {pfps.map(pfp => (
                    <li key={pfp.name}>
                        <button
                            onClick={() => selectIcon(pfp.src)}
                            className="focus:outline-none"
                        >
                            <img
                                src={pfp.src}
                                alt={pfp.name}
                                className={`w-10 h-10 rounded-full cursor-pointer transition ${formData.photo === pfp.src ? "ring-4" : ""}`}
                            />
                        </button>
                    </li>))}
            </ul>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="name">Name:</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label for="age">Age:</label>
                    <input
                        id="age"
                        name="age"
                        type="text"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="gender">Gender:</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    >
                        <option value="" disabled selected>-- Select a gender --</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label for="species">Species:</label>
                    <input
                        id="species"
                        name="species"
                        type="text"
                        value={formData.species}
                        onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="breed">Breed:</label>
                    <input
                        id="breed"
                        name="breed"
                        type="text"
                        value={formData.breed}
                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label for="color">Color:</label>
                    <input
                        id="color"
                        name="color"
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
            </div>

            <h2 className="font-bold mb-4">Owner Details</h2>
            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="fname">First Name:</label>
                    <input
                        id="fname"
                        name="fname"
                        type="text"
                        value={formData.fname}
                        onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label for="lname">Last Name:</label>
                    <input
                        id="lname"
                        name="lname"
                        type="text"
                        value={formData.lname}
                        onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="phone">Phone Number:</label>
                    <input
                        id="phone"
                        name="phone"
                        type="tel"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                    />
                </div>
                <div className="flex-1">
                    <label for="email">Email Address:</label>
                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="mb-4 p-2 w-full border rounded"
                    />
                </div>
            </div>

            <div>
                {editingPatient ? (
                    <>
                        <button
                            type="submit"
                            className="bg-blue-600 text-white mb-4 p-2 w-full rounded"
                        >
                            Update
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditingPatient(null)}
                            className="bg-gray-600 text-white p-2 w-full rounded"
                        >
                            Cancel
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            type="submit"
                            className="pill-button bg-blue-600 hover:bg-blue-700 text-white p-2 w-full rounded"
                        >
                            Create
                        </button>
                    </>
                )}
            </div>
        </form >
    );
};

export default PatientForm;