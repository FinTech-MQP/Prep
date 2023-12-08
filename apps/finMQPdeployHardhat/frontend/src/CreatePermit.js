// src/components/CreatePermit.js
import React, { useState } from 'react';

const CreatePermit = ({ contract, accounts }) => {
    const [propertyId, setPropertyId] = useState('');
    const [verificationHash, setVerificationHash] = useState('');
    const [gisDataHash, setGisDataHash] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Assuming createPermit is a method in your smart contract
        await contract.methods.CreatePermit(propertyId, verificationHash, gisDataHash)
            .send({ from: accounts[0] });
    };

    return (
        <div>
            <h2>Create New Permit</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={propertyId}
                    onChange={(e) => setPropertyId(e.target.value)}
                    placeholder="Property ID"
                />
                <input
                    type="text"
                    value={verificationHash}
                    onChange={(e) => setVerificationHash(e.target.value)}
                    placeholder="Verification Hash"
                />
                <input
                    type="text"
                    value={gisDataHash}
                    onChange={(e) => setGisDataHash(e.target.value)}
                    placeholder="GIS Data Hash"
                />
                <button type="submit">Create Permit</button>
            </form>
        </div>
    );
};

export default CreatePermit;
