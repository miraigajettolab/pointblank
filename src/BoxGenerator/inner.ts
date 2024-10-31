import styled from "styled-components";

export const BoxGeneratorInner = styled.div``;

export const BoxCanvas = styled.canvas``;

export const BoxTitle = styled.h2`
  position: fixed;
  top: 10px;
  right: 50%;
  transform: translateX(50%);
  text-align: center;
`;

export const BoxControls = styled.div`
  position: fixed;
  display: flex;
  column-gap: 10px;
  bottom: 60px;
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

export const Footnote = styled.div`
  display: flex;
  position: fixed;
  bottom: 20px;
  left: 20px;
`;
