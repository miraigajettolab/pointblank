export interface Point {
  x: number;
  y: number;
}

export interface BoxData {
  frontCorner: Point;
  yEnd1: Point;
  yEnd2: Point;
  yEnd3: Point;
  corner12: Point;
  corner13: Point;
  corner23: Point;
  backCorner: Point;
  vp1: Point;
  vp2: Point;
  vp3: Point;
}

export const getRandomAngleExcluding = (excludedAngles: number[] = [], bufferAngle: number = Math.PI / 2): number => {
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

export const getRandomLength = (min: number, max: number) => Math.floor(min + Math.random() * (max - min));

export const getRandomPointInTriangle = (p1: Point, p2: Point, p3: Point): Point => {
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

export const getRandomPointOnALine = (p1: Point, p2: Point): Point => {
  const slope = (p2.y - p1.y) / (p2.x - p1.x);
  const n = Math.random();
  const x = (p2.x - p1.x) * n + p1.x;
  const y = slope * (x - p1.x) + p1.y;

  return {
    x,
    y,
  };
};

export const getEndPoint = (start: Point, angle: number, length: number): Point => {
  return {
    x: start.x + length * Math.cos(angle),
    y: start.y + length * Math.sin(angle),
  };
};

export const getInsersectionPoint = (start1: Point, end1: Point, start2: Point, end2: Point): Point => {
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

export const generateBoxData = (canvasWidth: number, canvasHeight: number): BoxData => {
  const frontCorner: Point = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
  };

  const minDimention = Math.min(canvasWidth, canvasHeight);

  const angle1 = getRandomAngleExcluding();
  const angle2 = getRandomAngleExcluding([angle1]);
  const angle3 = getRandomAngleExcluding([angle1, angle2]);
  const length1 = getRandomLength(minDimention / 20, minDimention / 3);
  const length2 = getRandomLength(minDimention / 20, minDimention / 3);
  const length3 = getRandomLength(minDimention / 20, minDimention / 3);

  const yEnd1 = getEndPoint(frontCorner, angle1, length1);
  const yEnd2 = getEndPoint(frontCorner, angle2, length2);
  const yEnd3 = getEndPoint(frontCorner, angle3, length3);

  const intersection12 = getEndPoint(yEnd1, angle2, length2);
  const corner12 = getRandomPointInTriangle(yEnd1, yEnd2, intersection12);

  const vp1 = getInsersectionPoint(frontCorner, yEnd1, yEnd2, corner12);

  const corner13 = getRandomPointOnALine(
    yEnd3,
    getInsersectionPoint(yEnd1, getEndPoint(yEnd3, angle1, length1), yEnd3, vp1)
  );

  const vp2 = getInsersectionPoint(yEnd1, corner12, frontCorner, yEnd2);
  const vp3 = getInsersectionPoint(yEnd1, corner13, frontCorner, yEnd3);

  const corner23 = getInsersectionPoint(yEnd3, vp2, yEnd2, vp3);

  const backCorner = getInsersectionPoint(corner23, vp1, corner13, vp2);

  return {
    frontCorner,
    yEnd1,
    yEnd2,
    yEnd3,
    corner12,
    corner13,
    corner23,
    backCorner,
    vp1,
    vp2,
    vp3,
  };
};
