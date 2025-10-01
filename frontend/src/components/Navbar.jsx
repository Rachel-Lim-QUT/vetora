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
        <nav className="navbar">
            {/* left */}
            <div className="flex items-center">
                <Link to="/homepage">
                    <img
                        src={logo}
                        alt="logo"
                        className="h-8 w-8 mr-2" />
                </Link>
                <Link to="/homepage">
                    <h1 className="h1-nav">Vetora</h1>
                </Link>
            </div>

            {/* center */}
            <div className="flex items-center">
                <Link to="/appointments" className="mr-8">
                    <h2 className="h2-nav">Appointments</h2>
                </Link>
                <Link to="/patients" className="mr-8">
                    <h2 className="h2-nav">Patients</h2>
                </Link>
                <Link to="/owners">
                    <h2 className="h2-nav">Owners</h2>
                </Link>
            </div>

            {/* right */}
            <div className="flex items-center">
                <Link to="/profile">
                    <img src={profile} alt="profile" className="h-8 w-8 mr-2" />
                </Link>
                <button
                    onClick={handleLogout}
                    className="pill-button-s-pink"
                >
                    Logout
                </button>
            </div>
        </nav>
    );
};

export default Navbar;