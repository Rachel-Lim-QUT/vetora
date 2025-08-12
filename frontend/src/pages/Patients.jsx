import PatientForm from "../components/PatientForm";
import PatientList from "../components/PatientList";

const Patients = () => {
    return (
        <div className="container mx-auto p-6">
            <PatientForm/>
            <PatientList/>
        </div>
    );
};

export default Patients;