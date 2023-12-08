import React, { useState } from 'react';

function ApprovePermit({ contract, accounts }) {
    const [permitId, setPermitId] = useState('');
    const [newGisDataHash, setNewGisDataHash] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await contract.methods.approvePermit(permitId, newGisDataHash).send({ from: accounts[0] });
            alert('Permit approved successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Approve Permit</h2>
            <form onSubmit={handleSubmit}>
                <input type="number" value={permitId} onChange={(e) => setPermitId(e.target.value)} placeholder="Permit ID" />
                <input type="text" value={newGisDataHash} onChange={(e) => setNewGisDataHash(e.target.value)} placeholder="New GIS Data Hash" />
                <button type="submit">Approve Permit</button>
            </form>
        </div>
    );
}

export default ApprovePermit;
