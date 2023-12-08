import React, { useState } from 'react';

function VerifyOffChainDataHash({ contract }) {
    const [permitId, setPermitId] = useState('');
    const [offChainDataHash, setOffChainDataHash] = useState('');
    const [verificationResult, setVerificationResult] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const result = await contract.methods.verifyOffChainDataHash(permitId, offChainDataHash).call();
            setVerificationResult(result ? "Valid" : "Invalid");
        } catch (error) {
            alert(`Error: ${error.message}`);
        }
    };

    return (
        <div>
            <h2>Verify Off-Chain Data Hash</h2>
            <form onSubmit={handleSubmit}>
                {/* Inputs for permitId and offChainDataHash */}
                {/* ... */}
                <button type="submit">Verify Hash</button>
            </form>
            {verificationResult && <p>Verification Result: {verificationResult}</p>}
        </div>
    );
}

export default VerifyOffChainDataHash;
