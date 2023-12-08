// src/components/ViewPermits.js
import React, { useState, useEffect } from 'react';

const ViewPermits = ({ contract }) => {
    const [permits, setPermits] = useState([]);

    useEffect(() => {
        const loadPermits = async () => {
            // Assuming you have a function in your contract to get all permits
            const permitsData = await contract.methods.getAllPermits().call();
            setPermits(permitsData);
        };

        loadPermits();
    }, [contract]);

    return (
        <div>
            <h2>Existing Permits</h2>
            <ul>
                {permits.map((permit, index) => (
                    <li key={index}>
                        Property ID: {permit.propertyId}, Status: {permit.permitStatus}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default ViewPermits;
