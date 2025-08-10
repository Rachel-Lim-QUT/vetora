const PatientForm = () => {
    return (
        <form className="bg-white p-6 shadow-md rounded mb-6">
            <h1 className="text-2xl font-bold mb-4">Create New Patient</h1>

            <label for="fname">First Name:</label>
            <input
                id="fname"
                name="fname"
                type="text"
                placeholder="Enter the patient's first name."
                className="w-full mb-4 p-2 border rounded"
            />

            <label for="lname">Last Name:</label>
            <input
                id="lname"
                name="lname"
                type="text"
                placeholder="Enter the patient's last name."
                className="w-full mb-4 p-2 border rounded"
            />

            <label for="dob">Date of Birth:</label>
            <input
                id="dob"
                name="dob"
                type="date"
                className="w-full mb-4 p-2 border rounded"
            />

            <label for="gender">Gender:</label>
            <select
                id="gender"
                name="gender"
                className="w-full mb-4 p-2 border rounded"
            >
                <option value="" disabled selected>-- Select a gender. --</option>
                <option value="Female">Female</option>
                <option value="Male">Male</option>
                <option value="Other">Other</option>
            </select>

            <label for="phone">Phone Number:</label>
            <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter the patient's phone number."
                className="w-full mb-4 p-2 border rounded"
            />

            <label for="email">Email Address:</label>
            <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter the patient's email address."
                className="w-full mb-4 p-2 border rounded"
            />

            <button className="w-full bg-blue-600 text-white p-2 rounded">
                Create
            </button>
        </form>
    );
};

export default PatientForm;