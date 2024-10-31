import styled from "styled-components";

export const BoxGeneratorInner = styled.div``;

export const BoxCanvas = styled.canvas``;

export const BoxTitle = styled.h1`
  position: fixed;
  top: 0;
  right: 50%;
  transform: translateX(50%);
`;

export const BoxControls = styled.div`
  position: fixed;
  display: flex;
  column-gap: 10px;
  bottom: 40px;
  right: 50%;
  transform: translateX(50%);
`;

export const ControlButton = styled.button`
  height: 40px;
  padding: 0 20px;
  border: 1px solid black;
  border-radius: 10px;
  background-color: white;
  cursor: pointer;

  &:hover:not(:disabled) {
    background-color: ivory;
  }

  &:disabled {
    border-color: gray;
    cursor: default;
  }
`;
