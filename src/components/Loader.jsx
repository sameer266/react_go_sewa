import React from 'react';
import styled, { keyframes } from 'styled-components';

const spin = keyframes`
  50% {
    top: 76px;
  }
  100% {
    transform: rotate(360deg);
  }
`;

const updown = keyframes`
  50% {
    transform: translateY(-20%);
  }
  70% {
    transform: translateY(-10%);
  }
`;

const updownHalf = keyframes`
  50% {
    transform: translateY(-10%);
  }
  70% {
    transform: translateY(-5%);
  }
`;

const fade = keyframes`
  30% {
    opacity: 0.3;
    left: 7px;
  }
  50% {
    opacity: 0.5;
    left: 6px;
  }
  70% {
    opacity: 0.1;
    left: 4px;
  }
  90% {
    opacity: 0.4;
    left: 2px;
  }
`;

const bgMove = keyframes`
  from {
    background-position-x: 0px;
  }
  to {
    background-position-x: -400px;
  }
`;

const LoaderWrapper = styled.div`
  position: fixed;
  z-index: 1090;
  height: 100vh;
  width: 100vw;
  background-color: rgba(240, 240, 240, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TruckWrapper = styled.div`
  height: 220px;
  width: 220px;
  border: 5px solid #16a34a;
  position: absolute; /* Ensure absolute positioning */
  top: 50%; /* Center vertically */
  left: 50%; /* Center horizontally */
  transform: translate(-50%, -50%) scale(0.9); /* Center and scale */
  background: white;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: inset 0 0 15px rgba(0, 0, 0, 0.2), 0 0 10px rgba(22, 163, 74, 0.5);
  animation: ${bgMove} 0.5s linear infinite;

  &:after {
    content: 'GoSewa';
    font-size: 24px;
    font-family: 'Segoe UI', sans-serif;
    position: absolute;
    bottom: 0;
    text-align: center;
    width: 100%;
    border-top: 2px solid #16a34a;
    background: linear-gradient(to right, #16a34a 0%, #22c55e 100%);
    color: white;
    padding: 10px 0;
    animation: ${bgMove} 3s linear infinite;
  }
`;

const Truck = styled.div`
  height: 110px;
  width: 150px;
  position: absolute;
  bottom: 48px;
  left: 50%;
  transform: translateX(-50%);
`;

const Glases = styled.div`
  background: linear-gradient(135deg, #1f2937 0%, #1f2937 50%, #111827 52%, #111827 100%);
  position: absolute;
  height: 25px;
  width: 143.9px;
  border: 4px solid #22c55e;
  border-bottom: none;
  top: 35.5px;
  left: -19px;
  border-top-right-radius: 6px;
  animation: ${updownHalf} 0.4s linear infinite;

  &:after {
    content: '';
    display: block;
    background-color: #22c55e;
    height: 6px;
    width: 3px;
    position: absolute;
    right: -6px;
    bottom: 0;
    border-radius: 10px / 15px;
    border-bottom-right-radius: 0;
    border-bottom-left-radius: 0;
    border-top-left-radius: 0;
  }

  &:before {
    content: '';
    display: block;
    background-color: #22c55e;
    height: 27px;
    width: 3px;
    position: absolute;
    left: 102px;
    bottom: 0;
  }
`;

const Bonet = styled.div`
  background-color: #22c55e;
  position: absolute;
  width: 153.8px;
  height: 15px;
  top: 64px;
  left: -19px;
  z-index: -1;
  animation: ${updown} 0.4s linear infinite;

  &:after {
    content: '';
    display: block;
    background: linear-gradient(135deg, #ffffff 0%, #f1f1f1 50%, #e5e5e5 51%, #f6f6f6 100%);
    height: 10px;
    width: 6px;
    position: absolute;
    right: 0;
    bottom: 2px;
    border-top-left-radius: 4px;
  }
`;

const Base = styled.div`
  position: absolute;
  background-color: #15803d;
  width: 134px;
  height: 15px;
  border-top-right-radius: 10px;
  top: 70px;
  left: -15px;
  animation: ${updown} 0.4s linear infinite;

  &:before {
    content: '';
    display: block;
    background-color: #dc2626;
    height: 20px;
    width: 5px;
    position: absolute;
    left: -4px;
    bottom: 0;
    border-bottom-left-radius: 4px;
  }

  &:after {
    content: '';
    display: block;
    background-color: #15803d;
    height: 10px;
    width: 20px;
    position: absolute;
    right: -16px;
    bottom: 0;
    border-bottom-right-radius: 4px;
    z-index: -1;
  }
`;

const BaseAux = styled.div`
  width: 3px;
  height: 26px;
  background-color: #22c55e;
  position: absolute;
  top: 38px;
  left: 25px;
  animation: ${updownHalf} 0.4s linear infinite;
`;

const Wheel = styled.div`
  border-radius: 100%;
  position: absolute;
  background: linear-gradient(135deg, #374151 0%, #374151 49%, #1f2937 52%, #1f2937 100%);
  top: 75px;
  height: 22px;
  width: 22px;
  animation: ${spin} 0.6s linear infinite;

  &:before {
    content: '';
    border-radius: 100%;
    left: 5px;
    top: 5px;
    position: absolute;
    background: linear-gradient(135deg, #d1d5db 0%, #d1d5db 50%, #9ca3af 51%, #9ca3af 100%);
    height: 12px;
    width: 12px;
  }
`;

const WheelBack = styled(Wheel)`
  left: 20px;
`;

const WheelFront = styled(Wheel)`
  left: 95px;
`;

const Smoke = styled.div`
  position: absolute;
  background-color: #d1d5db;
  border-radius: 100%;
  width: 8px;
  height: 8px;
  top: 90px;
  left: 6px;
  animation: ${fade} 0.4s linear infinite;
  opacity: 0;

  &:after {
    content: '';
    position: absolute;
    background-color: #9ca3af;
    border-radius: 100%;
    width: 6px;
    height: 6px;
    top: -4px;
    left: 4px;
  }

  &:before {
    content: '';
    position: absolute;
    background-color: #9ca3af;
    border-radius: 100%;
    width: 4px;
    height: 4px;
    top: -2px;
    left: 0;
  }
`;

const Loader = () => {
  return (
    <LoaderWrapper>
      <TruckWrapper>
        <Truck>
          <Glases />
          <Bonet />
          <Base />
          <BaseAux />
          <WheelBack />
          <WheelFront />
          <Smoke />
        </Truck>
      </TruckWrapper>
    </LoaderWrapper>
  );
};

export default Loader;