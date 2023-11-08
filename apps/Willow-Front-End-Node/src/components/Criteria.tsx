import { useState } from "react";
import { programs } from "@monorepo/utils/constants";
import { ProgramCriteria } from "@monorepo/utils/interfaces";
import { Range } from "react-range";
import styled from "@emotion/styled";

const Container = styled.div`
  padding: 20px;
  max-width: 800px;
  margin: auto;
`;

const Label = styled.label`
  display: block;
  margin: 10px 0;
`;

const Track = styled.div`
  height: 6px;
  width: 100%;
  margin-top: 10px;
`;

const Thumb = styled.div`
  height: 20px;
  width: 20px;
  background-color: #999;
`;

const ProgramContainer = styled.div`
  margin-top: 20px;
`;

const Criteria = () => {
  // State for your criteria
  const [amiValues, setAmiValues] = useState<[number, number]>([0, 120]);
  const [adaValues, setAdaValues] = useState<[number, number]>([0, 100]);
  const [isMixedIncome, setIsMixedIncome] = useState<boolean>(false);
  const [affordabilityTerm, setAffordabilityTerm] = useState<number>(0);
  const [buildingCommencement, setBuildingCommencement] = useState<string>("");
  const [occupancyDate, setOccupancyDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];

  const ProgramInfo = styled.div<{ isApplicable: boolean }>`
    padding: 10px;
    margin-bottom: 5px;
    background-color: ${(props) =>
      props.isApplicable ? "#b8e994" : "#ff6b6b"};
    color: black;
  `;

  const checkCriteria = (
    programCriteria: ProgramCriteria,
    userCriteria: ProgramCriteria
  ) => {
    const checks = [];

    // AMI Range Check
    if (
      userCriteria.amiRange[0] < programCriteria.amiRange[0] ||
      userCriteria.amiRange[1] > programCriteria.amiRange[1]
    ) {
      checks.push(
        `AMI range is outside program criteria (${userCriteria.amiRange.join(
          "-"
        )}% vs ${programCriteria.amiRange.join("-")}%)`
      );
    }

    // ADA Range Check
    if (
      userCriteria.adaRange[0] < programCriteria.adaRange[0] ||
      userCriteria.adaRange[1] > programCriteria.adaRange[1]
    ) {
      checks.push(
        `ADA range is outside program criteria (${userCriteria.adaRange.join(
          "-"
        )}% vs ${programCriteria.adaRange.join("-")}%)`
      );
    }

    // Mixed Income Check
    if (programCriteria.mixedIncome && !userCriteria.mixedIncome) {
      checks.push(
        "Program requires mixed income and the property is not mixed income."
      );
    }

    // Affordability Term Check
    if (userCriteria.affordabilityTerm < programCriteria.affordabilityTerm) {
      checks.push(
        `Affordability term is less than required (${userCriteria.affordabilityTerm} years vs ${programCriteria.affordabilityTerm} years minimum).`
      );
    }

    // Additional checks can be added here similarly

    return checks.join(" | ");
  };

  // Function to determine if a user's criteria match a program's criteria
  // Additional checks within the criteriaMatch function
  const criteriaMatch = (
    programCriteria: ProgramCriteria,
    userCriteria: ProgramCriteria
  ) => {
    const amiMatch =
      userCriteria.amiRange[0] >= programCriteria.amiRange[0] &&
      userCriteria.amiRange[1] <= programCriteria.amiRange[1];
    const adaMatch =
      userCriteria.adaRange[0] >= programCriteria.adaRange[0] &&
      userCriteria.adaRange[1] <= programCriteria.adaRange[1];
    const mixedIncomeMatch =
      programCriteria.mixedIncome === userCriteria.mixedIncome;
    const affordabilityTermMatch =
      userCriteria.affordabilityTerm >= programCriteria.affordabilityTerm;

    let priorityAmiMatch = true;
    if (programCriteria.priorityAmi) {
      priorityAmiMatch =
        userCriteria.amiRange[1] <= programCriteria.priorityAmi;
    }

    let unhousedMatch = true;
    if (programCriteria.unhoused !== undefined) {
      unhousedMatch = programCriteria.unhoused === userCriteria.unhoused;
    }

    return (
      amiMatch &&
      adaMatch &&
      mixedIncomeMatch &&
      affordabilityTermMatch &&
      priorityAmiMatch &&
      unhousedMatch
    );
  };

  // Render the component
  return (
    <Container>
      {/* AMI Range slider */}
      <label>
        AMI Range: {amiValues[0]}% - {amiValues[1]}%
      </label>
      <Range
        step={1}
        min={0}
        max={120}
        values={amiValues}
        onChange={(values) => setAmiValues(values)}
        renderTrack={({ props, children }) => {
          const percentageLeft = (amiValues[0] / 120) * 100;
          const percentageRight = (amiValues[1] / 120) * 100;
          return (
            <Track
              {...props}
              style={{
                ...props.style,
                height: "6px",
                background: `linear-gradient(to right, #ccc ${percentageLeft}%, #54a0ff ${percentageLeft}%, #54a0ff ${percentageRight}%, #ccc ${percentageRight}%)`,
                width: "100%",
              }}
            >
              {children}
            </Track>
          );
        }}
        renderThumb={({ props }) => (
          <Thumb
            {...props}
            style={{
              ...props.style,
              height: "20px",
              width: "20px",
              backgroundColor: "#999",
            }}
          />
        )}
      />

      {/* ADA Range slider */}
      <label>
        ADA Range: {adaValues[0]}% - {adaValues[1]}%
      </label>
      <Range
        step={1}
        min={0}
        max={100}
        values={adaValues}
        onChange={(values) => setAdaValues(values)}
        renderTrack={({ props, children }) => {
          const percentageLeft = (adaValues[0] / 100) * 100;
          const percentageRight = (adaValues[1] / 100) * 100;
          return (
            <Track
              {...props}
              style={{
                ...props.style,
                height: "6px",
                background: `linear-gradient(to right, #ccc ${percentageLeft}%, #10ac84 ${percentageLeft}%, #10ac84 ${percentageRight}%, #ccc ${percentageRight}%)`,
                width: "100%",
              }}
            >
              {children}
            </Track>
          );
        }}
        renderThumb={({ props }) => (
          <Thumb
            {...props}
            style={{
              ...props.style,
              height: "20px",
              width: "20px",
              backgroundColor: "#999",
            }}
          />
        )}
      />

      {/* Mixed Income Radio Buttons */}
      <fieldset>
        <legend>Is your property mixed income?</legend>
        <Label>
          <input
            type="radio"
            name="mixedIncome"
            value="yes"
            checked={isMixedIncome}
            onChange={() => setIsMixedIncome(true)}
          />
          Yes
        </Label>
        <Label>
          <input
            type="radio"
            name="mixedIncome"
            value="no"
            checked={!isMixedIncome}
            onChange={() => setIsMixedIncome(false)}
          />
          No
        </Label>
      </fieldset>

      {/* Affordability Term Slider */}
      <Label>
        Term of Affordability: {affordabilityTerm} Years
        <input
          type="range"
          min={0}
          max={50}
          value={affordabilityTerm}
          onChange={(e) => setAffordabilityTerm(Number(e.target.value))}
        />
      </Label>

      {/* Building Commencement Date Picker */}
      <Label>
        Expected Date of Building Commencement:
        <input
          type="date"
          value={buildingCommencement}
          min={today}
          onChange={(e) => setBuildingCommencement(e.target.value)}
        />
      </Label>

      {/* Occupancy Date Picker */}
      <Label>
        Expected Date of Occupancy:
        <input
          type="date"
          value={occupancyDate}
          min={today}
          onChange={(e) => setOccupancyDate(e.target.value)}
        />
      </Label>

      {/* Display all programs with color coding and explanations */}
      <ProgramContainer>
        <h2>All Programs</h2>
        {programs.map((program, index) => {
          const isApplicable = criteriaMatch(program.criteria, {
            amiRange: amiValues,
            adaRange: adaValues,
            mixedIncome: isMixedIncome,
            affordabilityTerm,
          });
          const explanation = isApplicable
            ? "Applicable"
            : checkCriteria(program.criteria, {
                amiRange: amiValues,
                adaRange: adaValues,
                mixedIncome: isMixedIncome,
                affordabilityTerm,
              });

          return (
            <ProgramInfo key={index} isApplicable={isApplicable}>
              <strong>{program.name}</strong>
              <p>{explanation}</p>
            </ProgramInfo>
          );
        })}
      </ProgramContainer>
    </Container>
  );
};

export default Criteria;
