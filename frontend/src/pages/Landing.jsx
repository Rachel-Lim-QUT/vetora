
import { Link } from 'react-router-dom';
import logo from '../images/logo.png';

const Landing = () => {
    return (
        <div className="yellow-bg flex flex-col items-center justify-center text-center">

            {/* clinic logo */}
            <img
                src={logo}
                alt="Vetora logo"
                className="w-40 h-40 mb-6"
            />

            {/* clinic name */}
            <h1 className="text-2xl font-bold mb-6">
                Vetora
            </h1>

            {/* buttons */}
            <div className="flex flex-col gap-4 items-center">

                {/* login */}
                <Link to="/Login" className="pill-button-m-pink"
                >
                    Login
                </Link>

                {/* register */}
                <Link to="/Register" className="pill-button-m-pink"
                >
                    Register
                </Link>
            </div>
        </div>
    );
};

export default Landing;