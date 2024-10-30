import React from "react";
import { BoxGeneratorInner } from "./inner";

const getRandomAngleExcluding = (excludedAngles: number[], exclutionAngle: number = Math.PI / 2): number => {
  const getRandomAngle = () => Math.random() * 2 * Math.PI;
  const angleInExclutionZone = (angle: number): boolean =>
    excludedAngles.some((excludedAngle) => {
      const moreThanLower = angle >= excludedAngle - exclutionAngle;
      const lessThanUpper = angle <= excludedAngle + exclutionAngle;
      return moreThanLower && lessThanUpper;
    });

  // Rolling like this until we get a correct answer is kinda bad, but I don't care
  // This can just loop forever too, if you mess up, but should be fine to get 3 angles like I need
  let randomAngle = getRandomAngle();
  while (angleInExclutionZone(randomAngle)) {
    randomAngle = getRandomAngle();
  }

  return randomAngle;
};

const BoxGenerator: React.FC = () => {
  return (
    <BoxGeneratorInner>
      <canvas></canvas>
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
