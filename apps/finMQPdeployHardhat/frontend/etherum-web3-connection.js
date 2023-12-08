//I have included this code in the App.js file already so not imported or not being used

import Web3 from 'web3';

let web3;

if (window.ethereum) {
    web3 = new Web3(window.ethereum);
    window.ethereum.enable().catch(error => {
        // User denied account access
        console.error("User denied account access")
    });
} else if (window.web3) {
    web3 = new Web3(window.web3.currentProvider);
} else {
    console.log('Non-Ethereum browser detected. You should consider installing MetaMask!');
}

export default web3;


