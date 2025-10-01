import Navbar from '../components/Navbar';

import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import axiosInstance from '../axiosConfig';
import OwnerDetails from "../components/OwnerDetails";

const OwnerProfile = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const [owners, setOwners] = useState(null);

    useEffect(() => {
        const fetchOwner = async () => {
            try {
                const response = await axiosInstance.get(`/api/owners/${id}`, {
                    headers: { Authorization: `Bearer ${user.token}` },
                });
                setOwners(response.data);
            } catch (error) {
                alert('Error: Failed to fetch owner.');
            }
        };
        if (user) fetchOwner();
    }, [user, id]);


    return (
        <>
            <Navbar />
            <OwnerDetails
                owners={owners}
                setOwners={setOwners}
            />
        </>
    );
};

export default OwnerProfile;