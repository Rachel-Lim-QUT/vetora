import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold">Vetora</Link>
      <div>
        <Link to="/patients" className="mr-4">Patients</Link>
        <Link to="/profile" className="mr-4">Profile</Link>
        <button
          onClick={handleLogout}
          className="pill-button bg-red-500 hover:bg-red-700 px-4 py-2"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;