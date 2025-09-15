

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';
import backImage from '../images/temp-back.gif';
import '../App.css';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', role: '', username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.post('/api/auth/register', formData);
      alert('Registration successful. Please log in.');
      navigate('/login');
    } catch (error) {
      alert('Registration failed. Please try again.');
    }
  };

  return (
    <div>
      <div className="max-w-md mx-auto mt-10  ">
        <form onSubmit={handleSubmit} className="bg-white p-6 shadow-md rounded">
          <h1 className="text-2xl font-bold mb-4 text-center">Create New Account</h1>

          <label for="name">Name:</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name."
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          />

          <label for="role">Role:</label>
          <select
            id="role"
            name="role"
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="w-full mb-4 p-2 border rounded"
            required
          >
            <option value="" disabled selected>-- Please select your role. --</option>
            <option value="Doctor">Doctor</option>
            <option value="Nurse">Nurse</option>
            <option value="Practice Manager">Practice Manager</option>
            <option value="Reception">Reception</option>
          </select>

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

          <button type="submit" className="w-full bg-green-600 text-white p-2 rounded">
            Create
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

    </div>
  );
};

export default Register;