import { useNavigate } from 'react-router-dom';
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";
import OwnerDetailsList from './OwnerDetailsList';

const OwnerDetails = ({ owners, setOwners }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const navigate = useNavigate();

    const [formData, setForm] = useState({
        fname: "",
        lname: "",
        phone: "",
        email: "",
    });

    const startEdit = () => {
        setForm({
            fname: owners.fname || "",
            lname: owners.lname || "",
            phone: owners.phone || "",
            email: owners.email || ""
        });
        setEditMode(true);
    };

    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const save = async (e) => {
        e.preventDefault();
        const { data } = await axiosInstance.put(`/api/owners/${owners._id}`, formData, {
            headers: { Authorization: `Bearer ${user.token}` },
        });
        setOwners(data)
        setEditMode(false);
    };

    const handleDelete = async (ownerID) => {
        try {
            await axiosInstance.delete(`/api/owners/${ownerID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Owner deleted successfully');
            navigate('/owners');
        } catch (error) {
            alert('Error deleting owner');
        } finally {
            setShowConfirm(false);
        }
    };

    const handleBack = () => {
        window.history.back();
    };

    return (
        <div className="grid grid-cols-5 gap-6 p-6">

            {/* left side */}
            <div className="col-span-2">

                {/* back button */}
                <div className="flex justify-start items-start mb-4">
                    <button
                        onClick={handleBack}
                        className="pill-button-s-pink">
                        Back
                    </button>
                </div>

                <div className="rounded-window bg-gray-100 mb-6 p-6 shadow-md">
                    <h1 className="font-bold text-2xl mb-4">
                        {editMode ? "Edit Owner" : "Owner Details"}
                    </h1>

                    <div className="flex gap-4">
                        {!editMode ? (
                            <>
                                <div className="flex-1">
                                    <label for="fname">First Name</label>
                                    <input
                                        id="fname"
                                        name="fname"
                                        type="text"
                                        value={owners.fname}
                                        onChange={onChange}
                                        className="rounded-input-field-disable mb-4"
                                        disabled
                                    />
                                </div>

                                <div className="flex-1">
                                    <label for="lname">Last Name</label>
                                    <input
                                        id="lname"
                                        name="lname"
                                        type="text"
                                        value={owners.lname}
                                        onChange={onChange}
                                        className="rounded-input-field-disable mb-4"
                                        disabled
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <label for="fname">First Name</label>
                                    <input
                                        id="fname"
                                        name="fname"
                                        type="text"
                                        value={formData.fname}
                                        onChange={onChange}
                                        className="rounded-input-field"
                                    />
                                </div>
                                <div className="flex-1">
                                    <label for="lname">Last Name</label>
                                    <input
                                        id="lname"
                                        name="lname"
                                        type="text"
                                        value={formData.lname}
                                        onChange={onChange}
                                        className="rounded-input-field mb-4"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-4 mb-4">
                        {!editMode ? (
                            <>
                                <div className="flex-1">
                                    <label for="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        maxLength={10}
                                        value={owners.phone}
                                        onChange={onChange}
                                        className="rounded-input-field-disable"
                                        disable
                                    />
                                </div>

                                <div className="flex-1">
                                    <label for="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={owners.email}
                                        onChange={onChange}
                                        className="rounded-input-field-disable"
                                        disabled
                                    />
                                </div>
                            </>
                        ) : (
                            <>
                                <div className="flex-1">
                                    <label for="phone">Phone Number</label>
                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        maxLength={10}
                                        value={formData.phone}
                                        onChange={onChange}
                                        className="rounded-input-field"
                                    />
                                </div>

                                <div className="flex-1">
                                    <label for="email">Email Address</label>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={onChange}
                                        className="rounded-input-field"
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="mb-4 flex items-end gap-2">
                        <div className="flex-1">
                            <label htmlFor="patientSelect">Select Pet</label>
                            <select
                                id="patientSelect"
                                value=""
                                className={`rounded-input-field-disable ${!editMode ? "rounded-input-field-disabled" : "rounded-input-field"}`}
                                disabled
                            >
                                <option value="">Select a pet</option>
                            </select>
                        </div>

                        <button
                            type="button"
                            disabled
                            className="pill-button-s-pink"
                        >
                            Add
                        </button>
                    </div>

                    {/* buttons */}
                    {!editMode ? (
                        <>
                            <button onClick={startEdit} className="pill-button-l-pink">Edit</button>
                            <button
                                onClick={() => setShowConfirm(true)}
                                className="pill-button-l-red-profile"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={save}
                                className="pill-button-l-green mr-4"
                            >
                                Save
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditMode(false)}
                                className="pill-button-l-grey"
                            >
                                Cancel
                            </button>
                        </>
                    )}

                    {/* show confirm */}
                    {showConfirm && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                            <div className="popup-box">
                                <p className="mb-4 font-medium text-lg">
                                    Are you sure you want to delete owner profile?
                                </p>

                                <div className="flex justify-center gap-4">
                                    <button
                                        onClick={() => handleDelete(owners._id)}
                                        className="pill-button-s-red"
                                    >
                                        Yes
                                    </button>

                                    <button
                                        onClick={() => setShowConfirm(false)}
                                        className="pill-button-s-grey"
                                    >
                                        No
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* right side */}
            <div className="col-span-2">
                <OwnerDetailsList
                    owners={owners}
                // setPatients={setPatients}
                />
            </div>
        </div>
    );
};

export default OwnerDetails;