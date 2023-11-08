import { useState } from "react";
import { programs } from "@monorepo/utils/constants";
import { Program, ProgramCriteria } from "@monorepo/utils/interfaces";
import { Range } from "react-range";

const Criteria = () => {
  // State for your criteria
  const [amiValues, setAmiValues] = useState<[number, number]>([0, 120]);
  const [adaValues, setAdaValues] = useState<[number, number]>([0, 100]);
  const [isMixedIncome, setIsMixedIncome] = useState<boolean>(false);
  const [affordabilityTerm, setAffordabilityTerm] = useState<number>(0);
  const [applicablePrograms, setApplicablePrograms] = useState<Program[]>([]);
  const [buildingCommencement, setBuildingCommencement] = useState<string>("");
  const [occupancyDate, setOccupancyDate] = useState<string>("");
  const today = new Date().toISOString().split("T")[0];

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

  // Function to determine applicable programs based on criteria
  const determineApplicablePrograms = () => {
    const userCriteria: ProgramCriteria = {
      amiRange: amiValues,
      adaRange: adaValues,
      mixedIncome: isMixedIncome,
      affordabilityTerm,
    };

    const applicable = programs.filter((program: { criteria: any }) =>
      criteriaMatch(program.criteria, userCriteria)
    );

    setApplicablePrograms(applicable);
  };

  // Render the component
  return (
    <div>
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
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                background: `linear-gradient(to right, #ccc ${percentageLeft}%, #54a0ff ${percentageLeft}%, #54a0ff ${percentageRight}%, #ccc ${percentageRight}%)`,
                width: "100%",
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => (
          <div
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
            <div
              {...props}
              style={{
                ...props.style,
                height: "6px",
                background: `linear-gradient(to right, #ccc ${percentageLeft}%, #10ac84 ${percentageLeft}%, #10ac84 ${percentageRight}%, #ccc ${percentageRight}%)`,
                width: "100%",
              }}
            >
              {children}
            </div>
          );
        }}
        renderThumb={({ props }) => (
          <div
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
        <label>
          <input
            type="radio"
            name="mixedIncome"
            value="yes"
            checked={isMixedIncome}
            onChange={() => setIsMixedIncome(true)}
          />
          Yes
        </label>
        <label>
          <input
            type="radio"
            name="mixedIncome"
            value="no"
            checked={!isMixedIncome}
            onChange={() => setIsMixedIncome(false)}
          />
          No
        </label>
      </fieldset>

      {/* Affordability Term Slider */}
      <label>
        Term of Affordability: {affordabilityTerm} Years
        <input
          type="range"
          min={0}
          max={50}
          value={affordabilityTerm}
          onChange={(e) => setAffordabilityTerm(Number(e.target.value))}
        />
      </label>

      {/* Building Commencement Date Picker */}
      <label>
        Expected Date of Building Commencement:
        <input
          type="date"
          value={buildingCommencement}
          min={today}
          onChange={(e) => setBuildingCommencement(e.target.value)}
        />
      </label>

      {/* Occupancy Date Picker */}
      <label>
        Expected Date of Occupancy:
        <input
          type="date"
          value={occupancyDate}
          min={today}
          onChange={(e) => setOccupancyDate(e.target.value)}
        />
      </label>

      <button onClick={determineApplicablePrograms}>Check Eligibility</button>

      {/* Display applicable programs */}
      {applicablePrograms.length > 0 ? (
        <div>
          <h2>Applicable Programs</h2>
          {applicablePrograms.map((program, index) => (
            <div key={index}>
              <strong>{program.name}</strong>
              <p>{program.description}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>No applicable programs found based on the current criteria.</p>
      )}
    </div>
  );
};

export default Criteria;
