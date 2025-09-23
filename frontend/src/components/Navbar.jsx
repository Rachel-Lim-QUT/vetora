import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

import logo from '../images/temp-logo.gif';
import profile from '../images/profile-icon.png';

const Navbar = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between items-center">
      {/* left */}
      <div className="flex items-center">
        <Link to="/homepage">
          <img
            src={logo}
            alt="logo"
            className="h-8 w-8 mr-2" />
        </Link>
        <Link to="/homepage" className="text-2xl font-bold">
          Vetora
        </Link>
      </div>

      {/* center */}
      <div className="flex items-center">
        <Link to="" className="mr-8">Appointments</Link>
        <Link to="/patients" className="mr-8">Patients</Link>
        <Link to="">Owners</Link>
      </div>

      {/* right */}
      <div className="flex items-center">
        <Link to="/profile">
          <img src={profile} alt="profile" className="h-8 w-8 mr-2" />
        </Link>
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