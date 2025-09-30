import Navbar from '../components/Navbar';

const Homepage = () => {
    return (
        <>
            <Navbar />
            <div>
                <div className="max-w-md mx-auto mt-20 text-center">
                    <h1>Welcome</h1>
                    <p className="para">
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec sit amet dignissim ante. Suspendisse convallis nunc vitae ultrices tincidunt. Cras dignissim tincidunt nibh. Pellentesque.
                    </p>
                </div>
            </div>

        </>
    );
};

export default Homepage;