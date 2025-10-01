import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

const PatientDetails = ({ patients, setPatients }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        photo: "",
        name: "",
        age: "",
        gender: "",
        species: "",
        breed: "",
        color: "",
        history: "",
        fname: "",
        lname: "",
        phone: "",
        email: ""
    });

    const startEdit = () => {
        setForm({
            photo: patients.photo || "",
            name: patients.name || "",
            age: patients.age || "",
            gender: patients.gender || "",
            species: patients.species || "",
            breed: patients.breed || "",
            color: patients.color || "",
            history: patients.history || "",
            fname: patients.fname || "",
            lname: patients.lname || "",
            phone: patients.phone || "",
            email: patients.email || ""
        });
        setEditMode(true);
    };

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const save = async (e) => {
        e.preventDefault();
        const { data } = await axiosInstance.put(`/api/patients/${patients._id}`, form, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setPatients(data);
        setEditMode(false);
    };

    const handleDelete = async (patientID) => {
        try {
            await axiosInstance.delete(`/api/patients/${patientID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Success! Patient deleted.')
            navigate('/patients');
        } catch (error) {
            alert('Error: Failed to delete patient.')
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="grid grid-cols-5 gap-6 p-6">

            {/* left side (pfp) */}
            <div className="col-span-2 flex flex-col items-center">
                <img
                    src={patients.photo}
                    alt="patient pfp"
                    className="w-96 h-96 mb-6"
                />
                <h1 className="">{patients.name}</h1>
            </div>

            {/* right side (patient details) */}
            <div className="rounded-window col-span-3 bg-gray-100 rounded shadow">
                <div key={patients._id}>

                    {/* row for columns */}
                    <div className="grid grid-cols-3 gap-6 p-6">
                        {/* column 1 */}
                        <div>
                            {!editMode ? (
                                <>
                                    <p><b>Name</b>: {patients.name} {patients.lname}</p>
                                    <p><b>Gender</b>: {patients.gender}</p>
                                    <p><b>Breed</b>: {patients.breed}</p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <label htmlFor="name" className="required block text-sm font-medium mb-1">Name</label>
                                        <input
                                            id="name"
                                            name="name"
                                            type="text"
                                            className="rounded-input-field mb-2"
                                            value={form.name}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="gender" className="required block text-sm font-medium mb-1">Gender</label>
                                        <select
                                            id="gender"
                                            name="gender"
                                            className="rounded-input-field mb-2"
                                            value={form.gender}
                                            onChange={onChange}
                                            required
                                        >
                                            <option>Female</option>
                                            <option>Male</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="breed" className="block text-sm font-medium mb-1">Breed</label>
                                        <input
                                            id="breed"
                                            name="breed"
                                            text="text"
                                            className="rounded-input-field"
                                            value={form.breed}
                                            onChange={onChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* column 2 */}
                        <div>
                            {!editMode ? (
                                <>
                                    <p><b>Age</b>: {patients.age}</p>
                                    <p><b>Species</b>: {patients.species}</p>
                                    <p><b>Color</b>: {patients.color}</p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <label htmlFor="age" className="required block text-sm font-medium mb-1">Age</label>
                                        <input
                                            id="age"
                                            name="age"
                                            type="text"
                                            className="rounded-input-field mb-2"
                                            value={form.age}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="species" className="required block text-sm font-medium mb-1">Species</label>
                                        <select
                                            id="species"
                                            name="species"
                                            className="rounded-input-field mb-2"
                                            value={form.species}
                                            onChange={onChange}
                                            required
                                        >
                                            <option>Cat</option>
                                            <option>Dog</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label htmlFor="color" className="block text-sm font-medium mb-1">Color</label>
                                        <input
                                            id="color"
                                            name="color"
                                            type="text"
                                            className="rounded-input-field"
                                            value={form.color}
                                            onChange={onChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        {/* column 3 */}
                        <div>
                            {!editMode ? (
                                <>
                                    <p><b>Owner</b>: {patients.fname} {patients.lname}</p>
                                    <p><b>Phone</b>: {patients.phone}</p>
                                    <p><b>Email</b>: {patients.email}</p>
                                </>
                            ) : (
                                <>
                                    <div className="mb-2">
                                        <label htmlFor="fname" className="required block text-sm font-medium mb-1">Owner's First Name</label>
                                        <input
                                            id="fname"
                                            name="fname"
                                            type="text"
                                            className="rounded-input-field mb-2"
                                            value={form.fname}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="lname" className="required block text-sm font-medium mb-1">Owner's Last Name</label>
                                        <input
                                            id="lname"
                                            name="lname"
                                            type="text"
                                            className="rounded-input-field mb-2"
                                            value={form.lname}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label htmlFor="phone" className="required block text-sm font-medium mb-1">Phone</label>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            maxLength={10}
                                            pattern="[0-9]{10}"
                                            className="rounded-input-field mb-2"
                                            value={form.phone}
                                            onChange={onChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-2">
                                        <label for="email" className="block text-sm font-medium mb-1">Email</label>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            className="rounded-input-field mb-2"
                                            value={form.email}
                                            onChange={onChange}
                                        />
                                    </div>
                                </>
                            )}
                        </div>
                    </div>

                    {/* row for history */}
                    {!editMode ? (
                        <div className="mx-6 flex flex-col">
                            <label for="history" className="mb-1">History:</label>
                            <textarea
                                id="history"
                                name="history"
                                type="text"
                                className="rounded-input-field-disable h-80"
                                value={patients.history}
                                disabled
                            />
                        </div>
                    ) : (
                        <div className="mx-6 flex flex-col">
                            <label for="history" className="mb-1">History</label>
                            <textarea
                                id="history"
                                name="history"
                                type="text"
                                className="rounded-input-field h-80"
                                value={form.history}
                                onChange={onChange}
                            />
                        </div>
                    )}

                    {/* row for buttons */}
                    <div className="p-6">
                        {!editMode ? (
                            <>
                                <button onClick={startEdit} className="pill-button-s-pink mr-4">Edit</button>
                                <button
                                    onClick={() => setShowConfirm(true)}
                                    className="pill-button-s-red"
                                >
                                    Delete
                                </button>
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={save}
                                    className="pill-button-s-green mr-4"
                                >
                                    Save
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditMode(false)}
                                    className="pill-button-s-grey"
                                >
                                    Cancel
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* show confirm */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="popup-box">
                        <p className="mb-4 font-medium text-lg">
                            Are you sure you want to delete patient profile?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(patients._id)}
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
    );
};

export default PatientDetails;