import React, { useEffect, useRef } from "react";
import { BoxCanvas, BoxGeneratorInner } from "./inner";

const getRandomAngleExcluding = (excludedAngles: number[] = [], bufferAngle: number = Math.PI / 2): number => {
  const CIRCLE_RADS = 2 * Math.PI;

  const getRandomAngle = () => Math.random() * CIRCLE_RADS;

  function getAngularDifference(angle1: number, angle2: number) {
    const diff = Math.abs(angle1 - angle2) % CIRCLE_RADS;
    return diff > Math.PI ? CIRCLE_RADS - diff : diff;
  }

  const angleInExclutionZone = (angle: number): boolean =>
    excludedAngles.some((excludedAngle) => getAngularDifference(excludedAngle, angle) < bufferAngle);

  // Rolling like this until we get a correct answer is kinda bad, but I don't care
  // This can just loop forever too, if you mess up, but should be fine to get 3 angles like I need
  let randomAngle = getRandomAngle();
  while (angleInExclutionZone(randomAngle)) {
    randomAngle = getRandomAngle();
  }

  return randomAngle;
};

const getRandomLength = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

const BoxGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) {
      return;
    }

    const minDimention = Math.min(context.canvas.width, context.canvas.height);

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const getEndLineCoordinates = (startX: number, startY: number, angle: number, length: number): number[] => {
      const endX = startX + length * Math.cos(angle);
      const endY = startY + length * Math.sin(angle);

      return [endX, endY];
    };

    const drawLine = (startX: number, startY: number, endX: number, endY: number) => {
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(startX, startY);
      context.lineTo(endX, endY);
      context.stroke();
    };

    const drawCenterLine = (angle: number, length: number) => {
      const startX = context.canvas.width / 2;
      const startY = context.canvas.height / 2;

      const [endX, endY] = getEndLineCoordinates(startX, startY, angle, length);

      drawLine(startX, startY, endX, endY);
    };

    const angle1 = getRandomAngleExcluding();
    const angle2 = getRandomAngleExcluding([angle1]);
    const angle3 = getRandomAngleExcluding([angle1, angle2]);
    const length1 = getRandomLength(minDimention / 40, minDimention / 4);
    const length2 = getRandomLength(minDimention / 40, minDimention / 4);
    const length3 = getRandomLength(minDimention / 40, minDimention / 4);

    drawCenterLine(angle1, length1);
    drawCenterLine(angle2, length2);
    drawCenterLine(angle3, length3);
  }, [canvasRef]);

  return (
    <BoxGeneratorInner>
      <BoxCanvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
