import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axiosInstance from '../axiosConfig';

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
<<<<<<< Updated upstream
=======
  const [submitting, setSubmitting] = useState(false);
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
    if (!formData.role) {
      alert('Please select a role.');
      return;
    }
>>>>>>> Stashed changes
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
<<<<<<< Updated upstream
=======
    } finally {
      setSubmitting(false);
>>>>>>> Stashed changes
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 px-4">
<<<<<<< Updated upstream
      {/* Modal Card */}
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
        {/* Header */}
=======
      <div className="w-full max-w-2xl rounded-2xl bg-white p-8 shadow-xl">
>>>>>>> Stashed changes
        <div className="mx-auto mb-6 flex w-12 items-center justify-center rounded-md bg-gray-200">
          <div className="h-6 w-6 rounded bg-gray-300" />
        </div>
        <h1 className="mb-8 text-center text-2xl font-semibold">Register</h1>

<<<<<<< Updated upstream
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row: First/Last name */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fname" className="mb-1 block text-sm text-gray-700">
                First name
              </label>
=======
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="fname" className="mb-1 block text-sm text-gray-700">First name</label>
>>>>>>> Stashed changes
              <input
                id="fname"
                name="fname"
                type="text"
                value={formData.fname}
                onChange={handleChange}
                placeholder="Enter first name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
<<<<<<< Updated upstream
              <label htmlFor="lname" className="mb-1 block text-sm text-gray-700">
                Last name
              </label>
=======
              <label htmlFor="lname" className="mb-1 block text-sm text-gray-700">Last name</label>
>>>>>>> Stashed changes
              <input
                id="lname"
                name="lname"
                type="text"
                value={formData.lname}
                onChange={handleChange}
                placeholder="Enter last name"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
          </div>

<<<<<<< Updated upstream
          {/* Row: Username (full width) */}
          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-gray-700">
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          {/* Row: Clinic / Role */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="clinic" className="mb-1 block text-sm text-gray-700">
                Clinic
              </label>
=======
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="clinic" className="mb-1 block text-sm text-gray-700">Clinic</label>
>>>>>>> Stashed changes
              <input
                id="clinic"
                name="clinic"
                type="text"
                value={formData.clinic}
                onChange={handleChange}
                placeholder="Enter clinic"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
              />
            </div>
            <div>
<<<<<<< Updated upstream
              <label htmlFor="role" className="mb-1 block text-sm text-gray-700">
                Role
              </label>
=======
              <label htmlFor="role" className="mb-1 block text-sm text-gray-700">Role</label>
>>>>>>> Stashed changes
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
              >
<<<<<<< Updated upstream
                <option value="" disabled>
                  -- Please select your role --
                </option>
=======
                <option value="" disabled>-- Please select your role --</option>
>>>>>>> Stashed changes
                <option value="Administrator">Administrator</option>
                <option value="Veterinarian">Veterinarian</option>
                <option value="Veterinary Nurse">Veterinary Nurse</option>
                <option value="Receptionist">Receptionist</option>
              </select>
            </div>
          </div>

<<<<<<< Updated upstream
          {/* Row: Password / Confirm password */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-gray-700">
                Password
              </label>
=======
          <div>
            <label htmlFor="username" className="mb-1 block text-sm text-gray-700">Username</label>
            <input
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              placeholder="Enter username"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="password" className="mb-1 block text-sm text-gray-700">Password</label>
>>>>>>> Stashed changes
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
<<<<<<< Updated upstream
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-gray-700">
                Confirm password
              </label>
=======
                autoComplete="new-password"
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="mb-1 block text-sm text-gray-700">Confirm password</label>
>>>>>>> Stashed changes
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Re-enter password"
                className="w-full rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
                required
<<<<<<< Updated upstream
=======
                autoComplete="new-password"
>>>>>>> Stashed changes
              />
            </div>
          </div>

<<<<<<< Updated upstream
          {/* Submit */}
          <button
            type="submit"
            className="w-full rounded-full bg-gray-300 py-2 font-medium text-gray-700 hover:bg-gray-400"
          >
            Register
          </button>

          {/* Footer links */}
=======
          <button
            type="submit"
            disabled={submitting}
            className={`w-full rounded-full py-2 font-medium ${
              submitting
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-gray-300 text-gray-700 hover:bg-gray-400'
            }`}
          >
            {submitting ? 'Registering…' : 'Register'}
          </button>

>>>>>>> Stashed changes
          <p className="text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:underline">
              Login
            </Link>
          </p>
        </form>
      </div>

<<<<<<< Updated upstream
      {/* Bottom Cancel button */}
=======
>>>>>>> Stashed changes
      <div className="absolute bottom-6">
        <Link
          to="/"
          className="inline-flex items-center justify-center rounded-full bg-gray-300 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-400"
        >
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default Register;
