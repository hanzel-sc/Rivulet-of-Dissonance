import React from "react";
import styled, { keyframes } from "styled-components";

// Helper to generate many frost flakes
const generateFrostFlakes = (n) => {
  let value = `${Math.random() * 100}vw -${Math.random() * 100}vh rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
  for (let i = 1; i < n; i++) {
    value += `, ${Math.random() * 100}vw -${Math.random() * 100}vh rgba(255,255,255,${0.3 + Math.random() * 0.7})`;
  }
  return value;
};

// Falling animation
const fall = keyframes`
  0% { transform: translateY(0) translateX(0); }
  100% { transform: translateY(120vh) translateX(30px); }
`;

const FrostLayer = styled.div`
  position: absolute;
  width: ${(props) => props.size}px;
  height: ${(props) => props.size}px;
  background: transparent;
  box-shadow: ${(props) => props.flakes};
  border-radius: 50%;
  animation: ${fall} ${(props) => props.duration}s linear infinite;

  &::after {
    content: " ";
    position: absolute;
    top: -120vh;
    width: ${(props) => props.size}px;
    height: ${(props) => props.size}px;
    background: transparent;
    box-shadow: ${(props) => props.flakes};
    border-radius: 50%;
  }
`;

const Container = styled.div`
  height: 100vh;
  width: 100%;
  background: linear-gradient(to bottom, #1b2735, #090a0f);
  overflow: hidden;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 0;
`;

const Frostfall = () => {
  return (
    <Container>
      <FrostLayer size={2} flakes={generateFrostFlakes(400)} duration={60} />
      <FrostLayer size={3} flakes={generateFrostFlakes(250)} duration={90} />
      <FrostLayer size={4} flakes={generateFrostFlakes(150)} duration={120} />
    </Container>
  );
};

export default Frostfall;
