// src/components/TransferPermit.js
import React, { useState } from 'react';

const TransferPermit = ({ contract, accounts }) => {
    const [permitId, setPermitId] = useState('');
    const [newOwner, setNewOwner] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Assuming you have a function in your contract to transfer permits
        await contract.methods.transferPermit(permitId, newOwner).send({ from: accounts[0] });
    };

    return (
        <div>
            <h2>Transfer Permit</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={permitId}
                    onChange={(e) => setPermitId(e.target.value)}
                    placeholder="Permit ID"
                />
                <input
                    type="text"
                    value={newOwner}
                    onChange={(e) => setNewOwner(e.target.value)}
                    placeholder="New Owner Address"
                />
                <button type="submit">Transfer</button>
            </form>
        </div>
    );
};

export default TransferPermit;
