// SPDX-License-Identifier: MIT
//pragma solidity ^0.8.19;  
pragma solidity  >=0.8.19 <0.9.0;

//import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

import {AccessControl} from "./AccessControl.sol";
import "hardhat/console.sol";
enum Status {
    Pending, //0
    Approved, //1
    Rejected, //2
    Canceled, //3
    None // 4
}

struct Permit {
    uint256 id;
    address owner;
    string propertyId;
    Status permitStatus;
    uint256 timestamp;
    bytes32 verificationHash;
    bytes32 gisDataHash;
}

//Permit pt; //using pt as an alias

struct Assessment {
    uint256 id;
    uint256 permitId;
    uint256 year;
    uint256 valueLand;
    uint256 valueTotal;
    bytes32 gisDataHash;
}


//Assessment at; //using at as an alias

contract fintechMQPsmartcontract is AccessControl {
    // Roles
    bytes32 public constant OWNER_ROLE = keccak256("OWNER_ROLE");
    bytes32 public constant APPROVER_ROLE = keccak256("APPROVER_ROLE");
    bytes32 public constant ASSESSOR_ROLE = keccak256("ASSESSOR_ROLE");
    bytes32 public constant DEVELOPER_ROLE = keccak256("DEVELOPER_ROLE");

    // State variables
    uint256 public nextPermitId;
    uint256 public nextAssessmentId;
    mapping(uint256 => Permit) public permits;
    mapping(uint256 => Assessment) public assessments;

    // Events
    event PermitCreated(uint256 indexed permitId, address indexed owner, string propertyId, string status, bytes32 gisDataHash);
    event PermitTransferred(uint256 indexed permitId, address indexed newOwner);
    event PermitApproved(uint256 indexed permitId, address indexed approver);
    event AssessmentCreated(uint256 indexed assessmentId, uint256 indexed permitId, uint256 year, uint256 valueLand, uint256 valueTotal, bytes32 gisDataHash);

  
    constructor(Permit[] memory existingPermits, Assessment[] memory existingAssessments, address initialApprover, address initialAssessor) {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(OWNER_ROLE, msg.sender);
        _grantRole(APPROVER_ROLE, initialApprover);
        _grantRole(ASSESSOR_ROLE, initialAssessor);
        _grantRole(DEVELOPER_ROLE, msg.sender);

 
        for (uint256 i = 0; i < existingPermits.length; i++) {
            permits[existingPermits[i].id] = existingPermits[i];
        }
        nextPermitId = existingPermits.length + 1;

        for (uint256 i = 0; i < existingAssessments.length; i++) {
            assessments[existingAssessments[i].id] = existingAssessments[i];
        }
        nextAssessmentId = existingAssessments.length + 1;
    }

    // Function to assign a role to an account
    function assignRole(string memory roleName, address account) public {
        // Only an account with the admin role can assign roles
        require(hasRole(DEFAULT_ADMIN_ROLE, msg.sender), "Caller is not an admin");

        // Convert roleName to bytes32
        bytes32 role = keccak256(abi.encodePacked(roleName));

        // Grant the specified role to the account
        _grantRole(role, account);
    }
    
    function createPermit(string memory propertyId, bytes32 verificationHash, bytes32 gisDataHash) public {
        require(hasRole(OWNER_ROLE, msg.sender) || hasRole(DEVELOPER_ROLE, msg.sender), "Caller is not the owner or developer");

        Permit memory newPermit = Permit({
        id: nextPermitId,
        owner: msg.sender,
        propertyId: propertyId,
        permitStatus: Status.Pending,
        timestamp: block.timestamp,
        verificationHash: verificationHash,
        gisDataHash: gisDataHash
    });

        permits[nextPermitId] = newPermit;
        emit PermitCreated(nextPermitId, msg.sender, propertyId, "Pending", gisDataHash);
        nextPermitId++;
    }

    function transferPermit(uint256 permitId, address newOwner, bytes32 offChainVerificationHash, bytes32 newGisDataHash) public {
        Permit storage permit = permits[permitId];
        require(hasRole(OWNER_ROLE, msg.sender) || permit.owner == msg.sender, "Not the owner or authorized");
        require(permit.permitStatus == Status.Approved, "Permit not approved"); 
        require(permit.verificationHash == offChainVerificationHash, "Invalid verification");

        permit.owner = newOwner;
        permit.gisDataHash = newGisDataHash;

        emit PermitTransferred(permitId, newOwner);
    }


    function approvePermit(uint256 permitId, bytes32 newGisDataHash) public {
        require(hasRole(APPROVER_ROLE, msg.sender), "Caller is not an approver");

        Permit storage permit = permits[permitId];
        permit.permitStatus = Status.Approved;
        permit.gisDataHash = newGisDataHash;

        emit PermitApproved(permitId, msg.sender);
    }

    function createAssessment(uint256 permitId, uint256 year, uint256 valueLand, uint256 valueTotal, bytes32 gisDataHash) public {
        require(hasRole(ASSESSOR_ROLE, msg.sender), "Caller is not an assessor");
        require(permits[permitId].id != 0, "Invalid permit");
        require(permits[permitId].permitStatus == Status.Approved, "Permit not approved");

        Assessment memory newAssessment = Assessment({
            id: nextAssessmentId,
            permitId: permitId,
            year: year,
            valueLand: valueLand,
            valueTotal: valueTotal,
            gisDataHash: gisDataHash
        });

        assessments[nextAssessmentId] = newAssessment;
        emit AssessmentCreated(nextAssessmentId, permitId, year, valueLand, valueTotal, gisDataHash);
        nextAssessmentId++;
    }

    function applyForPermitAsDeveloper(string memory propertyId, bytes32 verificationHash, bytes32 gisDataHash) public {
        require(hasRole(DEVELOPER_ROLE, msg.sender), "Caller is not a developer");
        createPermit(propertyId, verificationHash, gisDataHash);
    }

    function verifyOffChainDataHash(uint256 permitId, bytes32 offChainDataHash) public view returns (bool) {
        bytes32 onChainDataHash = permits[permitId].gisDataHash;
        return onChainDataHash == offChainDataHash;
    }
}


//[[1,"0xd74C35E740a8d874B375a13DcB640010153aC28A","PropertyID1",0,1701559405,"0xb36c1798ed2b26751e2276dc223a8a88976e4ba07223df8465e1d499dcaebc6d","0x1000000000000000000000000000000000000000000000000000000000000001"]]
//[[1,1,2021,10000,15000,"0x0000000000000000000000000000000000000000000000000000000000000001"]]
//0xFAdC328b07e7079aE3383496E333b2cD2F3ef9f4 
//0xA781ECd764849482A28eBc2D06aB6d4dB4E9c6Da


//"cc665cf0838e4cad9cc98b22d22ae92f"