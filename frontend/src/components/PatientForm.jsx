import '../App.css';

import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

import amore from '../images/amore.gif';
import coolcat from '../images/coolcat.png';
import chatting from '../images/chatting.gif';

const PatientForm = ({ patients, setPatients }) => {
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/patients', formData, { headers: { Authorization: `Bearer ${user.token}` }, });
            setPatients([...patients, response.data]);
            setFormData({
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
            alert('Success! Patient record created.')
        } catch (error) {
            alert('Error: Unable to create patient record. Please try again.')
        } finally {
            // Jennifer's note: Refreshes the patient list after creating a patient profile
            const response = await axiosInstance.get('/api/patients', { headers: { Authorization: `Bearer ${user.token}` }, });
            setPatients(response.data);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-window mb-6 p-6">
            <h1 className="font-bold text-2xl mb-4">Create New Patient</h1>

            <label for="photo">Select an icon:</label>
            <ul className="flex gap-4 my-4">
                {pfps.map(pfp => (
                    <li key={pfp.name}>
                        <button
                            type="button"
                            onClick={() => selectIcon(pfp.src)}
                            className="focus:outline-none"
                        >
                            <img
                                src={pfp.src}
                                alt={pfp.name}
                                className={`w-10 h-10 rounded-full cursor-pointer transition ${formData.photo === pfp.src ? "ring-4" : ""}`}
                            />
                        </button>
                    </li>
                ))}
            </ul>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="name" className="required">Name</label>
                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="rounded-input-field mb-4"
                        required
                    />
                </div>
                <div className="flex-1">
                    <label for="age" className="required">Age</label>
                    <input
                        id="age"
                        name="age"
                        type="text"
                        value={formData.age}
                        onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                        className="rounded-input-field mb-4"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="gender" className="required">Gender</label>
                    <select
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        className="rounded-input-field mb-4"
                        required
                    >
                        <option value="" disabled selected>Select a gender</option>
                        <option value="Female">Female</option>
                        <option value="Male">Male</option>
                    </select>
                </div>
                <div className="flex-1">
                    <label for="species" className="required">Species</label>
                    <select
                        id="species"
                        name="species"
                        value={formData.species}
                        onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                        className="rounded-input-field mb-4"
                        required
                    >
                        <option value="" disabled selected>Select a species</option>
                        <option value="Cat">Cat</option>
                        <option value="Dog">Dog</option>
                    </select>
                </div>
            </div>

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="breed">Breed</label>
                    <input
                        id="breed"
                        name="breed"
                        type="text"
                        value={formData.breed}
                        onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                        className="rounded-input-field mb-4"
                    />
                </div>
                <div className="flex-1">
                    <label for="color">Color</label>
                    <input
                        id="color"
                        name="color"
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="rounded-input-field mb-4"
                    />
                </div>
            </div>

            {/* Fieldset for Owner Details */}
            <fieldset>
                <legend className="font-bold mb-4">Owner Details</legend>

                {/* First Name & Last Name Row */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label for="fname" className="required">First Name</label>
                        <input
                            id="fname"
                            name="fname"
                            type="text"
                            value={formData.fname}
                            onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
                            className="rounded-input-field mb-4"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label for="lname" className="required">Last Name</label>
                        <input
                            id="lname"
                            name="lname"
                            type="text"
                            value={formData.lname}
                            onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                            className="rounded-input-field mb-4"
                            required
                        />
                    </div>
                </div>

                {/* Phone Number & Email Address Row */}
                <div className="flex gap-4">
                    <div className="flex-1">
                        <label for="phone" className="required">Phone Number</label>
                        <input
                            id="phone"
                            name="phone"
                            type="tel"
                            maxLength={10}
                            pattern="[0-9]{10}"
                            value={formData.phone}
                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                            className="rounded-input-field mb-4"
                            required
                        />
                    </div>
                    <div className="flex-1">
                        <label for="email">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                            className="rounded-input-field mb-4"
                        />
                    </div>
                </div>
            </fieldset>

            <button
                type="submit"
                className="pill-button-l-pink"
            >
                Create
            </button>
        </form >
    );
};

export default PatientForm;