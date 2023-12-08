-- Create the 'permits' table
CREATE TABLE permits (
    permitId SERIAL PRIMARY KEY,
    owner VARCHAR(42) NOT NULL,
    propertyId VARCHAR(255) UNIQUE NOT NULL,
    permitStatus INT NOT NULL,
    timestamp INT NOT NULL, /*smart contract transaction timestamp*/
    verificationHash VARCHAR(255) NOT NULL,
    gisDataHash VARCHAR(255) NOT NULL
);

-- Create the 'assessments' table with a foreign key reference to 'permit_id'
CREATE TABLE assessments (
    id SERIAL PRIMARY KEY,
    permitId INT REFERENCES permits(permitId) NOT NULL,
    year INT NOT NULL,
	valueLand INT, /*land*/
    valueTotal INT, /*total*/
    gisDataHash VARCHAR(255) NOT NULL 
);

-- Insert data into the 'permits' table
INSERT INTO permits (owner, propertyId, permitStatus, timestamp, verificationHash, gisDataHash)
VALUES
    ('0xAddress1', 'PropertyID1', 1, 1701492827, '0xVerificationHash1', '0x1000000000000000000000000000000000000000000000000000000000000001'),
    ('0xAddress2', 'PropertyID2', 0, 1701492850, '0xVerificationHash2', '0x1000000000000000000000000000000000000000000000000000000000000002'),
    ('0xAddress3', 'PropertyID3', 1, 1701492899, '0xVerificationHash3', '0x1000000000000000000000000000000000000000000000000000000000000003');

 
-- Insert data into the 'assessments' table
INSERT INTO assessments (permitId, year, valueLand, valueTotal, gisDataHash)
VALUES
    (1, 2023, 40000, 50000, '0x0000000000000000000000000000000000000000000000000000000000000001'),
    (2, 2023, 53000, 60000, '0x0000000000000000000000000000000000000000000000000000000000000002'),
    (3, 2023, 51000, 55000, '0x0000000000000000000000000000000000000000000000000000000000000003');


SELECT * FROM permits;
SELECT * FROM assessments;

-- DROP Table assessments;
-- DROP Table permits;
