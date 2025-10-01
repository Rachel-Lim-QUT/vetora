import Navbar from '../components/Navbar';

import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import OwnerForm from "../components/OwnerForm";
import OwnerList from "../components/OwnerList";

const Owners = () => {
    const { user } = useAuth();
    const [owners, setOwners] = useState([]);

    // useEffect(() => {
    //     const fetchOwners = async () => {
    //         try {
    //             const response = await axiosInstance.get('/api/owners/', {
    //                 headers: { Authorization: `Bearer ${user.token}` },
    //             });
    //             setOwners(response.data);
    //         } catch (error) {
    //             alert('Error: Failed to fetch owner.')
    //         }
    //     };
    //     if (user) fetchOwners();
    // }, [user]);

    return (
        <>
            <Navbar />
            <div className="grid grid-cols-5 gap-6 p-6">
                <div className="col-span-2">
                    <OwnerForm
                        owners={owners}
                    // setOwners={setOwners}
                    />
                </div>
                <div className="col-span-3">
                    <OwnerList
                        owners={owners}
                        setOwners={setOwners}
                    />
                </div>
            </div>
        </>
    );
};

export default Owners;