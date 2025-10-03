import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import axiosInstance from "../axiosConfig";

const OwnerForm = ({ owners, setOwners }) => {
    const { user } = useAuth();
    const [selectedPatient, setSelectedPatient] = useState("");

    const [formData, setFormData] = useState({
        fname: "",
        lname: "",
        phone: "",
        email: "",
    });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data: newOwner } = await axiosInstance.post(
                "/api/owners",
                formData,
                { headers: { Authorization: `Bearer ${user.token}` } }
            );

            setOwners(prev => [...prev, newOwner]);

            setFormData({ fname: "", lname: "", phone: "", email: "" });
            setSelectedPatient("");

            alert("Owner created successfully!");
        } catch (err) {
            console.error(err);
            alert("Failed to create owner");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="rounded-window bg-gray-100 mb-6 p-6 shadow-md">
            <h1 className="font-bold text-2xl mb-4">Create New Owner</h1>

            {/* making sure user is logged in */}
            {!user?.token && (
                <p className="text-red-600 mb-4">
                    you are not logged in
                </p>
            )}

            <div className="flex gap-4">
                <div className="flex-1">
                    <label for="fname" className="required">First Name</label>
                    <input
                        id="fname"
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
                        type="text"
                        value={formData.lname}
                        onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
                        className="rounded-input-field mb-4"
                        required
                    />
                </div>
            </div>

            <div className="flex gap-4 mb-4">
                <div className="flex-1">
                    <label for="phone" className="required">Phone Number</label>
                    <input
                        id="phone"
                        type="tel"
                        maxLength={10}
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="rounded-input-field"
                    />
                </div>
                <div className="flex-1">
                    <label for="email">Email Address</label>
                    <input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="rounded-input-field"
                    />
                </div>
            </div>

            <div className="mb-4">
                <label for="petSelect"
                // className="required"
                >Select Pet</label>
                <select
                    id="petSelect"
                    value={selectedPatient}
                    onChange={(e) => setSelectedPatient(e.target.value)}
                    className="rounded-input-field"
                    disabled
                >
                    <option value="">Select a pet</option>
                </select>
            </div>

            <button type="submit" className="pill-button-l-pink">
                Create
            </button>
        </form>
    );
};

export default OwnerForm;