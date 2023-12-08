import React, { useEffect, useState } from 'react';
import Web3 from 'web3';
import fintechMQPABI from './finMQPsmartcontractABI.json';

// Import your components
import AssignRole from './AssignRole';
import CreatePermit from './CreatePermit';
import ViewPermit from './ViewPermitAssessments';
import UpdatePermit from './UpdatePermits';
import ApprovePermit from './ApprovePermit';
import CreateAssessment from './CreateAssessment';
import ApplyForPermitAsDeveloper from './ApplyForPermitAsDeveloper';
import VerifyOffChainDataHash from './VerifyOffChainDataHash';

import './App.css'; 

const CONTRACT_ADDRESS = "0xEb79764E5Aa2acf179Ad9bE11AD032E009DA0c7C";

const getWeb3 = () => {
    return new Promise((resolve, reject) => {
        window.addEventListener('load', async () => {
            if (window.ethereum) {
                const web3 = new Web3(window.ethereum);
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    resolve(web3);
                } catch (error) {
                    reject(error);
                }
            } else {
                reject('Please install MetaMask to use this DApp.');
            }
        });
    });
};

const getContract = async (web3) => {
    return new web3.eth.Contract(fintechMQPABI, CONTRACT_ADDRESS);
};

function App() {
    const [web3, setWeb3] = useState(undefined);
    const [contract, setContract] = useState(undefined);
    const [accounts, setAccounts] = useState(undefined);
    const [dataFromServer, setDataFromServer] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const init = async () => {
            try {
                const web3 = await getWeb3();
                const contractInstance = await getContract(web3);
                const accounts = await web3.eth.getAccounts();
    
                console.log("Contract Instance:", contractInstance); // Debug log
    
                setWeb3(web3);
                setContract(contractInstance);
                setAccounts(accounts);
            } catch (error) {
                console.error("Initialization error:", error);
                alert(error.message);
            }
        };
        init();

        // Fetch data from the server
        fetch('http://localhost:3001/api/data')
          .then(response => {
              if (!response.ok) {
                  throw new Error('Network response was not ok');
              }
              return response.json();
          })
          .then(data => setDataFromServer(data))
          .catch(error => setError(error));
    }, []);

    if (error) return <div>Error: {error.message}</div>;
    if (!dataFromServer) return <div>Loading data from server...</div>;

    return (
        <div className="App">
            <header className="App-header">
                <h1>Fintech MQP DApp</h1>
                <p>Connected Account: {accounts ? accounts[0] : 'Not connected'}</p>
            </header>
            <main>
                <AssignRole contract={contract} accounts={accounts} web3={web3} />
                <CreatePermit contract={contract} accounts={accounts} />
                {/* Uncomment other components as needed */}
                {/* <UpdatePermit contract={contract} accounts={accounts} /> */}
                <ViewPermit contract={contract} />
                <ApprovePermit contract={contract} accounts={accounts} />
                <CreateAssessment contract={contract} accounts={accounts} />
                <ApplyForPermitAsDeveloper contract={contract} accounts={accounts} />
                <VerifyOffChainDataHash contract={contract} />
            </main>
            <div>
                <h2>Data from Server</h2>
                <div>{JSON.stringify(dataFromServer)}</div>
            </div>
        </div>
    );
}

export default App;
