// SPDX-License-Identifier: MIT

pragma solidity >=0.7.0 <0.9.0;

//import "@openzeppelin/contracts/access/AccessControl.sol";
import {AccessControl} from "@openzeppelin/contracts/access/AccessControl.sol";

// Import the OpenZeppelin contract for access control

// Define the Permit structure
struct Permit {
    uint256 id;
    address owner;
    string propertyId;
    string status; // "Approved", "Pending", "Rejected"
    uint256 timestamp;
    bytes32 verificationHash; // Hash for two-step verification
    bytes32 gisDataHash; // Hash of the GIS data
}

// Define the Assessment structure
struct Assessment {
    uint256 id;
    uint256 permitId;
    uint256 year;
    uint256 value; // The assessed value
    bytes32 gisDataHash; // Hash of the GIS data related to the assessment
}

// Define the main contract
contract PermitManagement is AccessControl {
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
    event AssessmentCreated(uint256 indexed assessmentId, uint256 indexed permitId, uint256 year, uint256 value, bytes32 gisDataHash);

    // Constructor to initialize existing permits and set up roles
    constructor(
        Permit[] memory existingPermits,
        Assessment[] memory existingAssessments,
        address initialApprover,
        address initialAssessor
    ) 
    {
        _grantRole (DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole (OWNER_ROLE, msg.sender);
        _grantRole (APPROVER_ROLE, initialApprover);
        _grantRole (ASSESSOR_ROLE, initialAssessor);
        _grantRole (DEVELOPER_ROLE, msg.sender); // Assign developer role to the contract deployer

        for (uint256 i = 0; i < existingPermits.length; i++) {
            permits[existingPermits[i].id] = existingPermits[i];
        }
        nextPermitId = existingPermits.length + 1;

        for (uint256 i = 0; i < existingAssessments.length; i++) {
            assessments[existingAssessments[i].id] = existingAssessments[i];
        }
        nextAssessmentId = existingAssessments.length + 1;
    }

    // Create a new permit
    function createPermit(string memory propertyId, bytes32 verificationHash, bytes32 gisDataHash) public {
        require(hasRole(OWNER_ROLE, msg.sender) || hasRole(DEVELOPER_ROLE, msg.sender), "Caller is not the owner or developer");

        Permit memory newPermit = Permit({
            id: nextPermitId,
            owner: msg.sender,
            propertyId: propertyId,
            status: "Pending",
            timestamp: block.timestamp,
            verificationHash: verificationHash,
            gisDataHash: gisDataHash
        });

        permits[nextPermitId] = newPermit;
        emit PermitCreated(nextPermitId, msg.sender, propertyId, "Pending", gisDataHash);
        nextPermitId++;
    }

    // Transfer ownership of a permit
    function transferPermit(uint256 permitId, address newOwner, bytes32 offChainVerificationHash, bytes32 newGisDataHash) public {
        Permit storage permit = permits[permitId];
        require(hasRole(OWNER_ROLE, msg.sender) || permit.owner == msg.sender, "Not the owner or authorized");
        require(keccak256(abi.encodePacked(permit.status)) == keccak256(abi.encodePacked("Approved")), "Permit not approved");
        require(permit.verificationHash == offChainVerificationHash, "Invalid verification");

        // Update GIS data hash and ownership
        permit.owner = newOwner;
        permit.gisDataHash = newGisDataHash;

        emit PermitTransferred(permitId, newOwner);
    }

    // Approve a permit
    function approvePermit(uint256 permitId, bytes32 newGisDataHash) public {
        require(hasRole(APPROVER_ROLE, msg.sender), "Caller is not an approver");

        Permit storage permit = permits[permitId];
        permit.status = "Approved";
        permit.gisDataHash = newGisDataHash; // Update GIS data hash upon approval

        emit PermitApproved(permitId, msg.sender);
    }

// Create a new assessment
function createAssessment(uint256 permitId, uint256 year, uint256 value, bytes32 gisDataHash) public {
    require(hasRole(ASSESSOR_ROLE, msg.sender), "Caller is not an assessor");
    require(permits[permitId].id != 0, "Invalid permit");
    
    // Convert the storage value to a string and compare using keccak256
    require(keccak256(bytes(permits[permitId].status)) == keccak256(bytes("Approved")), "Permit not approved");

    Assessment memory newAssessment = Assessment({
        id: nextAssessmentId,
        permitId: permitId,
        year: year,
        value: value,
        gisDataHash: gisDataHash
    });

    assessments[nextAssessmentId] = newAssessment;
    emit AssessmentCreated(nextAssessmentId, permitId, year, value, gisDataHash);
    nextAssessmentId++;
}

    // Developer applies for a permit
    function applyForPermitAsDeveloper(string memory propertyId, bytes32 verificationHash, bytes32 gisDataHash) public {
        require(hasRole(DEVELOPER_ROLE, msg.sender), "Caller is not a developer");

        // Create a permit with the developer as the owner
        createPermit(propertyId, verificationHash, gisDataHash);
   
    }    
    // Function to verify off-chain data hash
    function verifyOffChainDataHash(uint256 permitId, bytes32 offChainDataHash) public view returns (bool) {
        // Retrieve the permit's GIS data hash from the Ethereum contract
        bytes32 onChainDataHash = permits[permitId].gisDataHash;

        // Assuming you have an off-chain service or Oracle to perform the verification
        // You would need to call that service and get the verification result

        // For demonstration purposes, let's assume an off-chain service returns true if the hashes match
        return onChainDataHash == offChainDataHash;
    }
 }
