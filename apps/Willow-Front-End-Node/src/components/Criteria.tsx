import { useState } from "react";
import { WILLOW_COLOR, programs } from "@monorepo/utils/constants";
import { ProgramCriteria } from "@monorepo/utils/interfaces";
import { Range } from "react-range";
import styled from "@emotion/styled";
import SoloSlider from "./SoloSlider";
import Typography, { TypographyProps } from "@mui/material/Typography";

const Container = styled.div`
  width: 95%;
  box-sizing: border-box;
  margin: 10px 0 10px 0;
`;

const RangeContainer = styled.div`
  margin: 10px 0 20px;
  padding: 0 10px 0 10px;
  box-sizing: border-box;
`;

const Track = styled.div`
  height: 6px;
  width: 100%;
  margin-top: 10px;
  box-sizing: border-box;
`;

const Thumb = styled.div`
  height: 20px;
  width: 20px;
  background-color: #999;
`;

const ProgramContainer = styled.div`
  margin-top: 20px;
  box-sizing: border-box;
`;

const ProgramInfo = styled.div<{ isApplicable: boolean }>`
  padding: 10px;
  margin-bottom: 5px;
  background-color: ${(props) => (props.isApplicable ? "#30cd95" : "#cd3030")};
  color: black;
  box-sizing: border-box;
  height: 120px;
  transition: background-color 0.3s ease;
`;

interface ProgramTypographyProps extends TypographyProps {
  isApplicable?: boolean;
}

const ProgramTypography = styled(Typography)<ProgramTypographyProps>`
  color: ${(props) => (props.isApplicable ? "black" : "white")};
  transition: color 0.3s ease;
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

  const evaluateCriteria = (
    programCriteria: ProgramCriteria,
    userCriteria: {
      amiRange: any;
      adaRange: any;
      mixedIncome: any;
      affordabilityTerm: any;
      unhoused?: any;
      marketRate?: any;
    }
  ) => {
    const explanations = [];

    // Check each criterion and add to explanations if there's a mismatch
    if (
      userCriteria.amiRange[0] < programCriteria.amiRange[0] ||
      userCriteria.amiRange[1] > programCriteria.amiRange[1]
    ) {
      explanations.push(
        `AMI range (${userCriteria.amiRange.join(
          "-"
        )}%) is outside the program criteria (${programCriteria.amiRange.join(
          "-"
        )}%)`
      );
    }
    if (
      userCriteria.adaRange[0] < programCriteria.adaRange[0] ||
      userCriteria.adaRange[1] > programCriteria.adaRange[1]
    ) {
      explanations.push(
        `ADA range (${userCriteria.adaRange.join(
          "-"
        )}%) is outside the program criteria (${programCriteria.adaRange.join(
          "-"
        )}%)`
      );
    }
    if (programCriteria.mixedIncome && !userCriteria.mixedIncome) {
      explanations.push(
        "Program requires mixed income and the property is not mixed income"
      );
    }
    if (userCriteria.affordabilityTerm < programCriteria.affordabilityTerm) {
      explanations.push(
        `Affordability term (${userCriteria.affordabilityTerm} years) is less than required (${programCriteria.affordabilityTerm} years minimum)`
      );
    }
    if (
      programCriteria.priorityAmi &&
      userCriteria.amiRange[1] > programCriteria.priorityAmi
    ) {
      explanations.push(
        `Priority is given to those with AMI under ${programCriteria.priorityAmi}%, your upper range is ${userCriteria.amiRange[1]}%`
      );
    }
    if (
      programCriteria.unhoused !== undefined &&
      programCriteria.unhoused !== userCriteria.unhoused
    ) {
      explanations.push(
        "Program is specific to unhoused individuals, which does not match your criteria"
      );
    }
    if (
      programCriteria.marketRate !== undefined &&
      userCriteria.marketRate !== programCriteria.marketRate
    ) {
      explanations.push(
        `Program is for ${
          programCriteria.marketRate ? "market rate" : "non-market rate"
        } developments which does not match your criteria`
      );
    }

    // Additional checks can be added similarly...

    // Return match status and explanation
    return {
      match: explanations.length === 0,
      explanation: explanations.join(". ") || "Applicable",
    };
  };

  // Render the component
  return (
    <Container>
      {/* AMI Range slider */}
      <Typography>
        AMI Range: {amiValues[0]}% - {amiValues[1]}%
      </Typography>
      <RangeContainer>
        <Range
          step={1}
          min={0}
          max={120}
          values={amiValues}
          onChange={(values: number[]) => setAmiValues([values[0], values[1]])}
          renderTrack={({ props, children }) => {
            const percentageLeft = (amiValues[0] / 120) * 100;
            const percentageRight = (amiValues[1] / 120) * 100;
            return (
              <Track
                {...props}
                style={{
                  ...props.style,
                  height: "6px",
                  background: `linear-gradient(to right, #ccc ${percentageLeft}%, ${WILLOW_COLOR} ${percentageLeft}%, ${WILLOW_COLOR} ${percentageRight}%, #ccc ${percentageRight}%)`,
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
                height: "12px",
                width: "12px",
                borderRadius: "50%",
                border: "2px solid black",
                backgroundColor: "white",
              }}
            />
          )}
        />
      </RangeContainer>

      {/* ADA Range slider */}
      <Typography>
        ADA Range: {adaValues[0]}% - {adaValues[1]}%
      </Typography>
      <RangeContainer>
        <Range
          step={1}
          min={0}
          max={100}
          values={adaValues}
          onChange={(values: number[]) => setAdaValues([values[0], values[1]])}
          renderTrack={({ props, children }) => {
            const percentageLeft = (adaValues[0] / 100) * 100;
            const percentageRight = (adaValues[1] / 100) * 100;
            return (
              <Track
                {...props}
                style={{
                  ...props.style,
                  height: "6px",
                  background: `linear-gradient(to right, #ccc ${percentageLeft}%, ${WILLOW_COLOR} ${percentageLeft}%, ${WILLOW_COLOR} ${percentageRight}%, #ccc ${percentageRight}%)`,
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
                height: "12px",
                width: "12px",
                borderRadius: "50%",
                border: "2px solid black",
                backgroundColor: "white",
              }}
            />
          )}
        />
      </RangeContainer>

      {/* Mixed Income Radio Buttons */}
      <fieldset>
        <legend
          style={{ fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif' }}
        >
          Is your property mixed income?
        </legend>
        <Typography>
          <input
            type="radio"
            name="mixedIncome"
            value="yes"
            checked={isMixedIncome}
            onChange={() => setIsMixedIncome(true)}
          />
          Yes
        </Typography>
        <Typography>
          <input
            type="radio"
            name="mixedIncome"
            value="no"
            checked={!isMixedIncome}
            onChange={() => setIsMixedIncome(false)}
          />
          No
        </Typography>
      </fieldset>

      {/* Affordability Term Slider */}
      <Typography sx={{ marginTop: "20px" }} component="div">
        Term of Affordability: {affordabilityTerm} Years
        <SoloSlider
          min={0}
          max={100}
          step={1}
          initialValue={0}
          onChange={(value: any) => setAffordabilityTerm(Number(value))}
          fillColor={WILLOW_COLOR}
        />
      </Typography>

      {/* Building Commencement Date Picker */}
      <Typography sx={{ marginTop: "10px" }}>
        Expected Date of Building Commencement:
        <br />
        <input
          type="date"
          value={buildingCommencement}
          min={today}
          onChange={(e) => setBuildingCommencement(e.target.value)}
          style={{ marginTop: "4px" }}
        />
      </Typography>

      {/* Occupancy Date Picker */}
      <Typography sx={{ marginTop: "10px" }}>
        Expected Date of Occupancy:
        <br />
        <input
          type="date"
          value={occupancyDate}
          min={today}
          onChange={(e) => setOccupancyDate(e.target.value)}
          style={{ marginTop: "4px" }}
        />
      </Typography>

      {/* Display all programs with color coding and explanations */}
      <ProgramContainer>
        <Typography variant="h5" fontWeight={700}>
          ALL PROGRAMS
        </Typography>
        {programs.map((program, index) => {
          const { match, explanation } = evaluateCriteria(program.criteria, {
            amiRange: amiValues,
            adaRange: adaValues,
            mixedIncome: isMixedIncome,
            affordabilityTerm,
            // Add other criteria as necessary
          });

          return (
            <ProgramInfo key={index} isApplicable={match}>
              <ProgramTypography fontWeight={700} isApplicable={match}>
                {program.name}
              </ProgramTypography>
              <ProgramTypography isApplicable={match}>
                {explanation}
              </ProgramTypography>
            </ProgramInfo>
          );
        })}
      </ProgramContainer>
    </Container>
  );
};

export default Criteria;
