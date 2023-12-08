// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.

//const hre = require("hardhat");



// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
    // The code inside this function will be executed by Hardhat's runtime environment

    // Define the existing permits and assessments data

    let existingPermits = [
      [
          1, // id
          '0xd74C35E740a8d874B375a13DcB640010153aC28A', // owner
          'PropertyID1', // propertyId
          0, // status (assuming 0 for 'Pending')
          1701559405, // timestamp
          '0xb36c1798ed2b26751e2276dc223a8a88976e4ba07223df8465e1d499dcaebc6d', // verificationHash
          '0x1000000000000000000000000000000000000000000000000000000000000001' // gisDataHash
      ]
      // ... other permits
  ];

  let existingAssessments = [
      [
          1, // id
          1, // permitId
          2021, // year
          10000, // valueLand
          15000, // valueTotal
          '0x0000000000000000000000000000000000000000000000000000000000000001' // gisDataHash
      ],
      // ... other assessments
  ];

    // Define initial approver and assessor
    let initialApprover = '0x6f4e3Ef41AF0351F3F91d95afd74a0a365f1e7a0'; //created on metamask Goerli accounts
    let initialAssessor = '0xE9Fe340cD0E5D0410FC7D54F3B003eAA029b48cd'; //created on metamask Goerli accounts

    // Get the ContractFactory and Signer
    const [deployer] = await ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);
    const FintechMQPSmartContract = await ethers.getContractFactory("fintechMQPsmartcontract");

    // Deploy the contract
    const fintechMQPsmartcontract = await FintechMQPSmartContract.deploy(
      existingPermits, 
      existingAssessments, 
      initialApprover, 
      initialAssessor);

  
    console.log("fintechMQPsmartcontract deployed to:", fintechMQPsmartcontract.target);

  //await fintechMQPsmartcontract.deployTransaction.wait()
    //await fintechMQPsmartcontract.waitForDeployment();

    //const currentValue = await fintechMQPsmartcontract.{function_call}();
    //console.log("CurrentValue", currentValues)

    //const transactionResponse = await fintechMQPsmartcontract.{function_call}();
    //await transactionResponse.wait(1) 

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(()=>process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exitC(1);
});
