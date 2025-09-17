import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

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
        owner_fname: '',
        owner_lname: '',
        owner_phone: '',
        owner_email: ''
    });

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
        } catch (error) {
            alert('Error: Patient file save failed. Please try again.');
        }
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white mb-6 p-6 rounded shadow-md">
            <h1 className="font-bold text-2xl mb-4">{editingPatient ? 'Update Patient Details' : 'Create New Patient'}</h1>

            <label for="photo">Photo:</label>
            <input
                id="photo"
                name="photo"
                type="file"
                accept="image/jpeg, image/png"
                value={formData.photo}
                onChange={(e) => setFormData({ ...formData, photo: e.target.value })}
                className="mb-4 pt-1 w-full"
            />

            <label for="name">Name:</label>
            <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter the patient's name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="age">Age:</label>
            <input
                id="age"
                name="age"
                type="text"
                placeholder="Enter the patient's age"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="dob">Date of Birth:</label>
            <input
                id="dob"
                name="dob"
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

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

            <label for="species">Species:</label>
            <input
                id="species"
                name="species"
                type="text"
                placeholder="Enter the patient's species"
                value={formData.species}
                onChange={(e) => setFormData({ ...formData, species: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="breed">Breed:</label>
            <input
                id="breed"
                name="breed"
                type="text"
                placeholder="Enter the patient's breed"
                value={formData.breed}
                onChange={(e) => setFormData({ ...formData, breed: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="color">Color:</label>
            <input
                id="color"
                name="color"
                type="text"
                placeholder="Enter the patient's color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <h2 className="mb-4">Owner Details</h2>

            <label for="owner_fname">First Name:</label>
            <input
                id="owner_fname"
                name="owner_fname"
                type="text"
                placeholder="Enter the owner's first name"
                value={formData.owner_fname}
                onChange={(e) => setFormData({ ...formData, owner_fname: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="owner_lname">Last Name:</label>
            <input
                id="owner_lname"
                name="owner_lname"
                type="text"
                placeholder="Enter the owner's last name"
                value={formData.owner_lname}
                onChange={(e) => setFormData({ ...formData, owner_lname: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
                required
            />

            <label for="owner_phone">Phone Number:</label>
            <input
                id="owner_phone"
                name="owner_phone"
                type="tel"
                maxLength={10}
                placeholder="Enter the owner's phone number"
                value={formData.owner_phone}
                onChange={(e) => setFormData({ ...formData, owner_phone: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
            />

            <label for="owner_email">Email Address:</label>
            <input
                id="owner_email"
                name="owner_email"
                type="email"
                placeholder="Enter the owner's email address"
                value={formData.owner_email}
                onChange={(e) => setFormData({ ...formData, owner_email: e.target.value })}
                className="mb-4 p-2 w-full border rounded"
            />

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
                            className="bg-blue-600 text-white p-2 w-full rounded"
                        >
                            Create
                        </button>
                    </>
                )}
            </div>
        </form>
    );
};

export default PatientForm;