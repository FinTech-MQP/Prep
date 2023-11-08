/** @jsxImportSource @emotion/react */
import { SerializedStyles, css } from "@emotion/react";
import styled from "@emotion/styled";
import React, { useEffect, useRef, useState } from "react";

// Define the props types for the slider
type SoloSliderProps = {
  min: number;
  max: number;
  step: number;
  initialValue: number;
  onChange: (value: number) => void;
  fillColor: string;
};

// Slider Container
const SliderContainer = styled.div`
  width: 100%;
  padding: 15px 0;
`;

// Slider Track
const SliderTrack = css`
  width: 100%;
  height: 5px;
  cursor: pointer;
  background: #d3d3d3; /* Default track color */

  border-radius: 5px;
  position: relative;
  -webkit-appearance: none;
  &:focus {
    outline: none;
  }
  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 2px solid black;
    background: #ffffff;
    cursor: pointer;
    position: relative;
    z-index: 2;
  }
  &::-moz-range-thumb {
    width: 25px;
    height: 25px;
    border-radius: 50%;
    background: #ffffff;
    cursor: pointer;
  }
`;

// Filled Track
const getFilledTrack = (
  color: string,
  value: number,
  min: number,
  max: number
): SerializedStyles => {
  const percentage = ((value - min) / (max - min)) * 100;
  return css`
    background: linear-gradient(
      to right,
      ${color} 0%,
      ${color} ${percentage}%,
      #d3d3d3 ${percentage}%,
      #d3d3d3 100%
    );
  `;
};

const SoloSlider: React.FC<SoloSliderProps> = ({
  min,
  max,
  step,
  initialValue,
  onChange,
  fillColor,
}) => {
  const [sliderValue, setSliderValue] = useState<number>(initialValue);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(e.target.value);
    setSliderValue(newValue);
    onChange(newValue);
  };

  // Here we directly apply the generated styles from getFilledTrack
  const trackStyle = getFilledTrack(fillColor, sliderValue, min, max);

  return (
    <SliderContainer>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={sliderValue}
        onChange={handleChange}
        css={[SliderTrack, trackStyle]} // Apply the trackStyle here
      />
    </SliderContainer>
  );
};

export default SoloSlider;
