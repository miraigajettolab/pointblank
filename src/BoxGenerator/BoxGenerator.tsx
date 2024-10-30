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

const getRandomPointOnALine = (p1: Point, p2: Point): Point => {
  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const n = Math.random();
  const x = (p2.x - p1.x) * n + p1.x;
  const y = slope * (x - p1.x) + p1.y;

  return {
    x,
    y,
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

    const getInsersectionPoint = (start1: Point, end1: Point, start2: Point, end2: Point): Point => {
      const denominator = (end2.y - start2.y) * (end1.x - start1.x) - (end2.x - start2.x) * (end1.y - start1.y);
      if (denominator === 0) {
        throw new Error("Denominator is 0 when trying to calculate line intersection");
      }

      let a = start1.y - start2.y;
      let b = start1.x - start2.x;

      const numerator1 = (end2.x - start2.x) * a - (end2.y - start2.y) * b;
      const numerator2 = (end1.x - start1.x) * a - (end1.y - start1.y) * b;

      a = numerator1 / denominator;
      b = numerator2 / denominator;

      // if we cast these lines infinitely in both directions, they intersect here:
      return { x: start1.x + a * (end1.x - start1.x), y: start1.y + a * (end1.y - start1.y) };
    };

    const drawLine = (start: Point, end: Point, color: string = "black", width = 3) => {
      context.strokeStyle = color;
      context.lineWidth = width;
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
    const length1 = getRandomLength(minDimention / 40, minDimention / 4);
    const length2 = getRandomLength(minDimention / 40, minDimention / 4);
    const length3 = getRandomLength(minDimention / 40, minDimention / 4);

    drawCenterLine(angle1, length1);
    drawCenterLine(angle2, length2);
    drawCenterLine(angle3, length3);

    const end1 = getEndPoint(centerPoint, angle1, length1);
    const end2 = getEndPoint(centerPoint, angle2, length2);
    const end3 = getEndPoint(centerPoint, angle3, length3);

    const intersection12 = getEndPoint(end1, angle2, length2);
    const corner12 = getRandomPointInTriangle(end1, end2, intersection12);

    drawLine(end1, corner12);
    drawLine(end2, corner12);

    const vp1 = getInsersectionPoint(centerPoint, end1, end2, corner12);

    const corner13 = getRandomPointOnALine(
      end3,
      getInsersectionPoint(end1, getEndPoint(end3, angle1, length1), end3, vp1)
    );
    drawLine(end1, corner13);
    drawLine(end3, corner13);

    const vp2 = getInsersectionPoint(end1, corner12, centerPoint, end2);
    const vp3 = getInsersectionPoint(end1, corner13, centerPoint, end3);

    drawLine(end1, vp1, "red", 1);
    drawLine(corner12, vp1, "red", 1);
    drawLine(corner13, vp1, "red", 1);

    drawLine(corner12, vp2, "green", 1);
    drawLine(end2, vp2, "green", 1);

    drawLine(corner13, vp3, "blue", 1);
    drawLine(end3, vp3, "blue", 1);
  }, [canvasRef]);

  return (
    <BoxGeneratorInner>
      <BoxCanvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} />
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
