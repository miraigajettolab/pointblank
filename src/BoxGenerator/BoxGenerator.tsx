import React, { useEffect, useRef } from "react";
import { BoxCanvas, BoxGeneratorInner } from "./inner";

interface Point {
  x: number;
  y: number;
}

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

const getRandomPointInTriangle = (p1: Point, p2: Point, p3: Point): Point => {
  const u = Math.random();
  const v = Math.random();

  const w = u + v;
  const adjustedU = w > 1 ? 1 - u : u;
  const adjustedV = w > 1 ? 1 - v : v;

  return {
    x: (1 - adjustedU - adjustedV) * p1.x + adjustedU * p2.x + adjustedV * p3.x,
    y: (1 - adjustedU - adjustedV) * p1.y + adjustedU * p2.y + adjustedV * p3.y,
  };
};

const BoxGenerator: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const centerPoint: Point = {
      x: context.canvas.width / 2,
      y: context.canvas.height / 2,
    };

    const minDimention = Math.min(context.canvas.width, context.canvas.height);

    const getEndPoint = (start: Point, angle: number, length: number): Point => {
      return {
        x: start.x + length * Math.cos(angle),
        y: start.y + length * Math.sin(angle),
      };
    };

    const drawLine = (start: Point, end: Point) => {
      context.lineWidth = 5;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    };

    const drawCenterLine = (angle: number, length: number) => {
      const endPoint = getEndPoint(centerPoint, angle, length);
      drawLine(centerPoint, endPoint);
    };

    const angle1 = getRandomAngleExcluding();
    const angle2 = getRandomAngleExcluding([angle1]);
    const angle3 = getRandomAngleExcluding([angle1, angle2]);
    const length1 = getRandomLength(minDimention / 10, minDimention / 4);
    const length2 = getRandomLength(minDimention / 10, minDimention / 4);
    const length3 = getRandomLength(minDimention / 10, minDimention / 4);

    drawCenterLine(angle1, length1);
    drawCenterLine(angle2, length2);
    drawCenterLine(angle3, length3);

    const end1 = getEndPoint(centerPoint, angle1, length1);
    const end2 = getEndPoint(centerPoint, angle2, length2);
    const intersection12 = getEndPoint(end1, angle2, length2);
    const corner12 = getRandomPointInTriangle(end1, end2, intersection12);

    drawLine(end1, corner12);
    drawLine(end2, corner12);
  }, [canvasRef]);

  return (
    <BoxGeneratorInner>
      <BoxCanvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
