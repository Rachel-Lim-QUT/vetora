
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
      navigate('/patients');
      alert('Login successful.');
    } catch (error) {
      alert('Login failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-20">
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
          <h1 className="text-2xl font-bold mb-4 text-center">Login to Cura+</h1>

          <label for="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Enter your username."
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label for="password">Password:</label>
          <input
            id="password"
            name="password"
            type="password"
            placeholder="Enter your password."
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded">
            Login
          </button>
        </form>
      </div>

      {/* back container */}
      <div className="back-container">
        {/* back button */}
        <Link to="/" type="submit" className="px-6 py-2
                          rounded-full
                          bg-gray-200
                          text-gray-800
                          text-center
                          hover:bg-gray-300"
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

    </div >
  );
};

export default Login;