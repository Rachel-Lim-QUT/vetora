import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import backImage from '../images/temp-back.gif';
import logo from '../images/temp-logo.gif';

const Register = () => {
    const [formData, setFormData] = useState({
        fname: '',
        lname: '',
        clinic: '',
        role: '',
        username: '',
        password: '',
    });
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((s) => ({ ...s, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }
        if (!formData.role) {
            alert('Please select a role.');
            return;
        }
        try {
            setSubmitting(true);
            const payload = {
                fname: formData.fname.trim(),
                lname: formData.lname.trim(),
                clinic: formData.clinic.trim(),
                role: formData.role,
                username: formData.username.trim(),
                password: formData.password,
            };
            await axiosInstance.post('/api/auth/register', payload);
            alert('Registration successful. Please log in.');
            navigate('/login');
        } catch (error) {
            alert(error?.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="dim-bg fixed inset-0 flex items-center justify-center">
            <div className="rounded-window p-10 w-[600px] shadow-md">
                {/* logo */}
                <img
                    src={logo}
                    alt="Logo"
                    className="logo mx-auto"
                />
                <h1 className="mb-4 text-2xl text-center">Register</h1>

                <form onSubmit={handleSubmit}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="fname" className="required mb-1">First Name</label>
                            <input
                                id="fname"
                                name="fname"
                                type="text"
                                value={formData.fname}
                                onChange={handleChange}
                                className="rounded-input-field mb-4"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="lname" className="required mb-1">Last Name</label>
                            <input
                                id="lname"
                                name="lname"
                                type="text"
                                value={formData.lname}
                                onChange={handleChange}
                                className="rounded-input-field mb-4"
                                required
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        <div>
                            <label htmlFor="clinic" className="required mb-1">Clinic</label>
                            <input
                                id="clinic"
                                name="clinic"
                                type="text"
                                value={formData.clinic}
                                onChange={handleChange}
                                className="rounded-input-field mb-4 mt-1 p-2 w-full shadow"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="role" className="required mb-1">Role</label>
                            <select
                                id="role"
                                name="role"
                                value={formData.role}
                                onChange={handleChange}
                                className="rounded-input-field mb-4"
                                required
                            >
                                <option value="" disabled selected>Select a Role</option>
                                <option value="Administrator">Administrator</option>
                                <option value="Veterinarian">Veterinarian</option>
                                <option value="Veterinary Nurse">Veterinary Nurse</option>
                                <option value="Receptionist">Receptionist</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="username" className="required mb-1">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={formData.username}
                            onChange={handleChange}
                            className="rounded-input-field mb-4"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 mb-4">
                        <div>
                            <label htmlFor="password" className="required mb-1">Password</label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="rounded-input-field"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="required mb-1">Confirm Password</label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="rounded-input-field"
                                required
                                autoComplete="new-password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={submitting}
                        className="pill-button-l-pink"
                    >
                        {submitting ? 'Registering…' : 'Register'}
                    </button>

                    <p className="text-center">
                        Already have an account?{' '}
                        <Link to="/login" className="link">Login</Link>
                    </p>
                </form>
            </div>

            <div className="back-container">
                {/* back button */}
                <Link
                    to="/"
                    type="submit"
                    className="pill-button-s-pink"
                >
                    Back
                </Link>

                {/* back image */}
                <img
                    src={backImage}
                    alt="Back"
                    className="back-image"
                />
            </div>
        </div>
    );
};

export default Register;