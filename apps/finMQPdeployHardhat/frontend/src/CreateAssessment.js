import React, { useState } from 'react';

function CreateAssessment({ contract, accounts }) {
    const [permitId, setPermitId] = useState('');
    const [year, setYear] = useState('');
    const [valueLand, setValueLand] = useState('');
    const [valueTotal, setValueTotal] = useState('');
    const [gisDataHash, setGisDataHash] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await contract.methods.createAssessment(permitId, year, valueLand, valueTotal, gisDataHash).send({ from: accounts[0] });
            alert('Assessment created successfully');
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Create Assessment</h2>
            <form onSubmit={handleSubmit}>
                {/* Inputs for permitId, year, valueLand, valueTotal, gisDataHash */}
                {/* ... */}
                <button type="submit">Create Assessment</button>
            </form>
        </div>
    );
}

export default CreateAssessment;
