
import { Link } from 'react-router-dom';
import logo from '../images/temp-logo.gif';

const Landing = () => {
    return (
        <div className="yellow-bg flex flex-col items-center justify-center min-h-screen text-center">

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
                <Link to="/Login" className="pill-button-s-pink hover:bg-rose-300"
                >
                    Login
                </Link>

                {/* register */}
                <Link to="/Register" className="pill-button-s-pink hover:bg-rose-300"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Landing;