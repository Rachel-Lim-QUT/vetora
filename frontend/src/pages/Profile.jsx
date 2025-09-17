import '../App.css';
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
  });
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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
      const payload = {
      fname: formData.fname,
      lname: formData.lname,
      username: formData.username,
      };
      await axiosInstance.put('/api/auth/profile', payload, {
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
      setShowConfirm(false);
    }
  };

  if (loading) {
    return <div className="mt-20 text-center">Loading...</div>;
  }

  return (
    <>
      <Navbar />
      <div className="max-w-lg mx-auto mt-20">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
          <h1 className="font-bold text-2xl text-center mb-4">Your Profile</h1>

          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="fname">First Name:</label>
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
            </div>
            <div className="flex-1">
              <label htmlFor="lname">Last Name:</label>
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
            </div>
          </div>

          <label htmlFor="clinic">Clinic:</label>
          <input
            id="clinic"
            name="clinic"
            type="text"
            placeholder="Clinic"
            value={formData.clinic}
            className="mb-4 p-2 w-full border rounded"
            disabled
          />

          <label htmlFor="role">Role:</label>
          <input
            id="role"
            name="role"
            type="text"
            placeholder="Role"
            value={formData.role}
            className="mb-4 p-2 w-full border rounded"
            disabled
          />

          <label htmlFor="username">Username:</label>
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
            className="pill-button bg-blue-600 hover:bg-blue-700 text-white mb-4 p-2 w-full"
          >
            {loading ? 'Updating...' : 'Update'}
          </button>

          <button
            type="button"
            onClick={handleChangePassword}
            className="pill-button bg-gray-600 hover:bg-gray-700 text-white mb-4 p-2 w-full"          
          >
            Change Password
          </button>

          <button
            type="button"
            onClick={() => setShowConfirm(true)}
            className="pill-button bg-red-600 hover:bg-red-700 text-white p-2 w-full"
          >
            Delete Account
          </button>
        </form>

      </div>
      {/* show confirm */}
      {showConfirm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50">
          <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-4">
            <p className="mb-4 font-medium text-lg">
              Are you sure you want to delete your account?
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-full"
              >
                Yes
              </button>

              <button
                onClick={() => setShowConfirm(false)}
                className="px-4 py-2 bg-gray-300 rounded-full"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )
      }
    </>
  );
};

export default Profile;