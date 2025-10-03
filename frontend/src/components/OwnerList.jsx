import { Link } from 'react-router-dom';

const OwnerList = ({ owners }) => {

    return (
        <div>
            {owners.map((owner) => (
                <div key={owner._id} className="flex items-center rounded-window mb-4 p-4">
                    {/* right side (patient details) */}
                    <div className="flex-1">
                        <p><b>Name</b>: {owner.fname} {owner.lname}</p>
                        <p><b>Phone</b>: {owner.phone}</p>
                        <p><b>Email</b>: {owner.email}</p>

                        <div className="mt-2">
                            <Link
                                to={`/ownerprofile/${owner._id}`}
                                className="pill-button-s-pink"
                            >
                                View
                            </Link>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default OwnerList;