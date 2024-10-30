import React from "react";
import { BoxGeneratorInner } from "./inner";

const BoxGenerator: React.FC = () => {
  return (
    <BoxGeneratorInner>
      <canvas></canvas>
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
