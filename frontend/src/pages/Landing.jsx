
import { Link, useNavigate } from 'react-router-dom';
import logo from '../images/temp-logo.gif';

const Landing = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center">

            {/* clinic logo */}
            <img
                src={logo}
                alt="Vetora logo"
                className="w-40 h-40 mb-6"
            />

            {/* clinic name */}
            <h1 className="text-2xl font-bold mb-8">
                Vetora
            </h1>

            {/* buttons */}
            <div className="flex flex-col gap-4 w-40 mx-auto">

                {/* login */}
                <Link to="/Login" className="px-6 py-2
                    rounded-full
                    bg-gray-200
                    text-gray-800
                    text-center
                    hover:bg-gray-300"
                >
                    Login
                </Link>

                {/* register */}
                <Link to="/Register" className="px-6 py-2
                    rounded-full
                    bg-gray-200
                    text-gray-800
                    text-center
                    hover:bg-gray-300"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Landing;