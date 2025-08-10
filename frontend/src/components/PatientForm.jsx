const PatientForm = () => {
    return (
        <form className="bg-white p-6 shadow-md rounded mb-6">
            <h1 className="text-2xl font-bold mb-4">Create New Patient</h1>

            <input
                type="text"
                placeholder="First Name"
                className="w-full mb-4 p-2 border rounded"
            />

            <input
                type="text"
                placeholder="Last Name"
                className="w-full mb-4 p-2 border rounded"
            />

            <input
                name="dob"
                type="date"
                className="w-full mb-4 p-2 border rounded"
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded">
                Create
            </button>
        </form>
    );
};

export default PatientForm;