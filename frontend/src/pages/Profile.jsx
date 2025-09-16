import Navbar from '../components/Navbar';

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';

const Profile = () => {
  const { user, logout } = useAuth();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    clinic: '',
    role: '',
    username: '',
    password: '',
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await axiosInstance.get('/api/auth/profile', {
          headers: { Authorization: `Bearer ${user.token}` },
        });
        setFormData({
          fname: response.data.fname,
          lname: response.data.lname,
          clinic: response.data.clinic,
          role: response.data.role,
          username: response.data.username,
        });
      } catch (error) {
        alert('Failed to fetch profile. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    if (user) fetchProfile();
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosInstance.put('/api/auth/profile', formData, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Success! Profile updated.');
    } catch (error) {
      alert('Error: Profile update failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    alert('Contact Admin\nadmin@vetora.com.au')
  }

  const handleDelete = async () => {
    setLoading(true);
    try {
      await axiosInstance.delete('/api/auth/profile/', {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      alert('Success! Account deleted.');
      logout();
      navigate('/');
    } catch (error) {
      alert('Error: Account deletion failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-md mx-auto mt-20">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h1 className="font-bold text-2xl text-center mb-4">Your Profile</h1>

          <label for="fname">First Name:</label>
          <input
            id="fname"
            name="fname"
            type="text"
            placeholder="First Name"
            value={formData.fname}
            onChange={(e) => setFormData({ ...formData, fname: e.target.value })}
            className="mb-4 p-2 w-full border rounded"
            required
          />

          <label for="lname">Last Name:</label>
          <input
            id="lname"
            name="lname"
            type="text"
            placeholder="Last Name"
            value={formData.lname}
            onChange={(e) => setFormData({ ...formData, lname: e.target.value })}
            className="mb-4 p-2 w-full border rounded"
            required
          />

          <label for="clinic">Clinic:</label>
          <input
            id="clinic"
            name="clinic"
            type="text"
            placeholder="Clinic"
            value={formData.clinic}
            className="mb-4 p-2 w-full border rounded"
            disabled
          />

          <label for="role">Role:</label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="Role"
            value={formData.role}
            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            className="mb-4 p-2 w-full border rounded"
            disabled
          />

          <label for="username">Username:</label>
          <input
            id="username"
            name="username"
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            className="mb-4 p-2 w-full border rounded"
            required
          />

          <button
            type="submit"
            className="bg-blue-600 text-white mb-4 p-2 w-full rounded"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            className="bg-gray-600 text-white mb-4 p-2 w-full rounded"          
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={handleDelete}
            className="bg-red-600 text-white p-2 w-full rounded"
          >
            Delete Account
          </button>
        </form>
      </div>
    </>
  );
};

export default Profile;