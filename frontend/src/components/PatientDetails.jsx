import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from "react";
import { useAuth } from '../context/AuthContext';
import axiosInstance from "../axiosConfig";

    const PatientDetails = ({ patients, setPatients }) => {
    const { user } = useAuth();
    const [showConfirm, setShowConfirm] = useState(false);
    const navigate = useNavigate();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({
    photo: "", name: "", age: "", gender: "", species: "",
    breed: "", color: "", history: "", fname: "", lname: "",
    phone: "", email: "" });

    const startEdit = () => {
    setForm({
      photo: patients.photo || "",
      name: patients.name || "",
      age: patients.age || "",
      gender: patients.gender || "",
      species: patients.species || "",
      breed: patients.breed || "",
      color: patients.color || "",
      history: patients.history || "",
      fname: patients.fname || "",
      lname: patients.lname || "",
      phone: patients.phone || "",
      email: patients.email || ""
    });
    setEditMode(true);
   };
    const onChange = (e) => setForm(s => ({ ...s, [e.target.name]: e.target.value }));

    const save = async (e) => {
    e.preventDefault();
    const { data } = await axiosInstance.put(`/api/patients/${patients._id}`, form, {
      headers: { Authorization: `Bearer ${user.token}` },
    });
    setPatients(data);
    setEditMode(false);
   };


    const handleDelete = async (patientID) => {
        try {
            await axiosInstance.delete(`/api/patients/${patientID}`, {
                headers: { Authorization: `Bearer ${user.token}` },
            });
            alert('Success! Patient deleted.')
            navigate('/patients');
            // setPatients(patients.filter((patient) => patient._id !== patientID));
        } catch (error) {
            alert('Error: Failed to delete patient.')
        } finally {
            setShowConfirm(false);
        }
    };

    return (
        <div className="grid grid-cols-5 gap-6 p-6">

            {/* left side (pfp) */}
            <div className="col-span-2 flex flex-col items-center">
                <img
                    src={patients.photo}
                    alt="patient pfp"
                    className="w-80 h-80 mb-6"
                />
                <h1 className="">{patients.name}</h1>
            </div>

            {/* right side (patient details) */}
            <div className="col-span-3 bg-gray-100 rounded shadow">
                <div key={patients._id}>

                    {/* row for columns */}
                    <div className="grid grid-cols-3 gap-6 p-6">
                        {/* column 1 */}
                        <div>
                            {!editMode ? (
                              <>
                                <p><b>Name</b>: {patients.name} {patients.lname}</p>
                                <p><b>Gender</b>: {patients.gender}</p>
                                <p><b>Breed</b>: {patients.breed}</p>
                              </>
                         ) : (
                              <>
                            <div className="mb-2">
                                <label htmlFor="name" className="block text-sm font-medium mb-1">Name</label>
                                <input name="name"  className="p-2 border rounded w-full mb-2" value={form.name}  onChange={onChange} />
                            </div>
                            <div className="mb-2">
                                <label htmlFor="gender" className="block text-sm font-medium mb-1">Gender</label>
                                <select name="gender" className="p-2 border rounded w-full mb-2" value={form.gender} onChange={onChange}>
                                  <option>Female</option><option>Male</option>
                                </select>
                            </div>
                            <div>
                                <label htmlFor="breed" className="block text-sm font-medium mb-1">Breed</label>
                                <input name="breed" className="p-2 border rounded w-full" value={form.breed} onChange={onChange} />
                            </div>
                             </>
                           )}
                        </div>

                        {/* column 2 */}
                        <div>
                            {!editMode ? (
                                <>
                                <p><b>Age</b>: {patients.age}</p>
                                <p><b>Species</b>: {patients.species}</p>
                                <p><b>Color</b>: {patients.color}</p>
                                </>
                                ) : (
                                    <>
                                <div className="mb-2">
                                    <label htmlFor="age" className="block text-sm font-medium mb-1">Age</label>  
                                    <input name="age" className="p-2 border rounded w-full mb-2" value={form.age} onChange={onChange} />
                                </div>
                                <div className="mb-2">
                                    <label htmlFor="species" className="block text-sm font-medium mb-1">Species</label>
                                    <select name="species" className="p-2 border rounded w-full mb-2" value={form.species} onChange={onChange}>
                                        <option>Cat</option><option>Dog</option>
                                    </select>
                                </div>
                                <div>
                                    <label htmlFor="color" className="block text-sm font-medium mb-1">Color</label>
                                    <input name="color" className="p-2 border rounded w-full" value={form.color} onChange={onChange} />
                                </div>
                               </>
                               
                             )}
                                
                        </div>

                        {/* column 3 */}
                        <div>
                            {!editMode ? (
                                <>
                                    <p><b>Owner</b>: {patients.fname} {patients.lname}</p>
                                    <p><b>Phone</b>: {patients.phone}</p>
                                   
                                </>
                                ) : (
                                <>
                                <div className="mb-2">
                                     <label htmlFor="fname" className="block text-sm font-medium mb-1">Owner First Name</label>
                                     <input name="fname" className="p-2 border rounded w-full mb-2" value={form.fname} onChange={onChange} />
                                </div>
                                 <div className="mb-2">
                                     <label htmlFor="lname" className="block text-sm font-medium mb-1">Owner Last Name</label>  
                                     <input id="lname" name="lname" className="p-2 border rounded w-full" value={form.lname} onChange={onChange} />
                               </div>
                                <div>
                                    <label htmlFor="phone" className="block text-sm font-medium mb-1">Phone</label>
                                    <input name="phone" className="p-2 border rounded w-full" value={form.phone} onChange={onChange} />
                                </div>
                                </>
                                )}
                            

                            
                        </div>
                    </div>

                    {/* row for history */}
                    <div className="mt-2 p-6">
                        <label for="history">History:</label>
                        <textarea
                            id="history"
                            name="history"
                            type="text"
                            className="h-80 mb-4 p-2 w-full border rounded"
                            // value={formData.history}
                        />
                    </div>

                    {/* row for buttons */}
                    <div className="mt-2 p-6">
                        {!editMode ? (
                            <>
                         <button onClick={startEdit} className="pill-button bg-yellow-500 text-white px-4 py-2 rounded">Edit</button>
                        <button
                            // onClick={() => handleDelete(patients._id)}
                            onClick={() => setShowConfirm(true)}
                            className="pill-button bg-red-500 text-white ml-2 px-4 py-2 rounded"
                        >
                            Delete
                        </button>
                    </>
                    ) : (
                     <>
                        
                        <button
                            onClick={save}
                            className="pill-button bg-blue-600 text-white px-4 py-2 rounded"
                         >
                            Save
                         </button>
                         <button
                          type="button"
                          onClick={() => setEditMode(false)}
                          className="pill-button bg-gray-400 text-white px-4 py-2 rounded"
                         >
                          Cancel
                         </button>
                        </>
                    )}
                </div>
             </div>
         </div>
            


            {/* show confirm */}
            {showConfirm && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/50">
                    <div className="bg-white p-6 rounded shadow text-center max-w-sm mx-4">
                        <p className="mb-4 font-medium text-lg">
                            Are you sure you want to delete patient profile?
                        </p>

                        <div className="flex justify-center gap-4">
                            <button
                                onClick={() => handleDelete(patients._id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-full"
                            >
                                Yes
                            </button>

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="px-4 py-2 bg-gray-300 rounded-full"
                            >
                                No
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PatientDetails;