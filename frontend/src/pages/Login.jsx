import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import backImage from '../images/temp-back.gif';
import '../App.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axiosInstance.post('/api/auth/login', formData);
            login(response.data);
            navigate('/homepage');
            alert('Login successful.');
        } catch (error) {
            alert('Login failed. Please try again.');
        }
    };

    return (
        <div>
            <div className="dim-bg flex fixed inset-0 items-center justify-center">
                <form onSubmit={handleSubmit} className="rounded-window p-10 w-[500px] shadow-md">
                    <h1 className="mb-4 text-2xl text-center">Login to Vetora</h1>

                    <label for="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className="rounded-input-field mb-4 mt-1 p-2 w-full shadow"
                        required
                    />

                    <label for="password">Password</label>
                    <input
                        id="password"
                        name="password"
                        type="password"
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        className="rounded-input-field mb-1 mt-1 p-2 w-full shadow"
                        required
                    />
                    <button type="button" className="link">Forgot password?</button>

                    <button
                        type="submit"
                        className="pill-button mb-4 mt-4 p-2 w-full shadow"
                    >
                        Login
                    </button>

                    <p className="text-center">
                        Don't have an account?
                        <Link to="/register" className="link"> Register</Link>
                    </p>
                </form>
            </div>

            {/* back container */}
            <div className="back-container">
                {/* back button */}
                <Link
                    to="/"
                    type="submit"
                    className="pill-button text-center px-6 py-2 shadow"
                >
                    Back
                </Link>

                {/* back image */}
                {/* <img
                    src={backImage}
                    alt="Back"
                    className="back-image"
                /> */}
            </div>
        </div>
    );
};

export default Login;