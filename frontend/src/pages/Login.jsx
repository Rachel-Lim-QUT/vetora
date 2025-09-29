import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import backImage from '../images/temp-back.gif';
import '../App.css';

const Login = () => {
    const [formData, setFormData] = useState({ username: '', password: '' });
    const [showForgotPassword, setShowForgotPassword] = useState(false);
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
                    <button type="button"
                        className="link hover:underline"
                        onClick={() => setShowForgotPassword(true)}
                    >
                        Forgot password?
                    </button>

                    <button
                        type="submit"
                        className="pill-button-l-pink hover:bg-rose-300"
                    >
                        Login
                    </button>

                    <p className="text-center">
                        Don't have an account?{' '}
                        <Link to="/register" className="link hover:underline">Register</Link>
                    </p>
                </form>
            </div>

            {/* back container */}
            <div className="back-container">
                {/* back button */}
                <Link
                    to="/"
                    type="submit"
                    className="pill-button-s-pink hover:bg-rose-300"
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

            {/* show forgot password */}
            {showForgotPassword && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="popup-box">
                        <h1 className="pb-2">
                            Contact admin
                        </h1>

                        <p className="pb-2">
                            admin@vetora.com.au
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => setShowForgotPassword(false)}
                                className="pill-button-s-pink hover:bg-rose-300"
                            >
                                Ok
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Login;