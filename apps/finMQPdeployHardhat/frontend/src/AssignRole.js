import Web3 from 'web3';

import React, { useState } from 'react';

function AssignRole({ contract, accounts, Web3}) {
    const [role, setRole] = useState('');
    const [address, setAddress] = useState('');

    const handleRoleChange = (event) => {
        setRole(event.target.value);
    };

    const handleAddressChange = (event) => {
        setAddress(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await contract.methods.assignRole(role, address).send({ from: accounts[0] });
            alert('Role assigned successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Assign Role</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>
                        Role:
                        <select value={role} onChange={handleRoleChange}>
                            <option value="">Select a Role</option>
                            <option value="Admin">Admin</option>
                            <option value="Owner">Owner</option>
                            <option value="Approver">Approver</option>
                            <option value="Assessor">Assessor</option>
                            <option value="Developer">Developer</option>
                        </select>
                    </label>
                </div>
                <div>
                    <label>
                        Address:
                        <input type="text" value={address} onChange={handleAddressChange} />
                    </label>
                </div>
                <button type="submit">Assign Role</button>
            </form>
        </div>
    );
}

export default AssignRole;

