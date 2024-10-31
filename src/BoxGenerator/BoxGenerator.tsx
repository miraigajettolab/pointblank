import React, { useEffect, useRef, useState } from "react";
import { BoxCanvas, BoxGeneratorInner } from "./inner";
import { BoxData, Point, generateBoxData } from "./util";

const BoxGenerator: React.FC = () => {
  const canvasHeight = window.innerHeight;
  const canvasWidth = window.innerWidth;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState<BoxData>(generateBoxData(canvasWidth, canvasHeight));

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const drawLine = (start: Point, end: Point, color: string = "black", width = 3) => {
      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    };

    drawLine(box.frontCorner, box.yEnd1);
    drawLine(box.frontCorner, box.yEnd2);
    drawLine(box.frontCorner, box.yEnd3);

    drawLine(box.yEnd1, box.corner12);
    drawLine(box.yEnd2, box.corner12);

    drawLine(box.yEnd1, box.corner13);
    drawLine(box.yEnd3, box.corner13);

    drawLine(box.yEnd2, box.corner23);
    drawLine(box.yEnd3, box.corner23);

    drawLine(box.corner13, box.backCorner);
    drawLine(box.corner12, box.backCorner);
    drawLine(box.corner23, box.backCorner);

    drawLine(box.yEnd1, box.vp1, "red", 1);
    drawLine(box.corner12, box.vp1, "red", 1);
    drawLine(box.corner13, box.vp1, "red", 1);
    drawLine(box.backCorner, box.vp1, "red", 1);

    drawLine(box.corner12, box.vp2, "green", 1);
    drawLine(box.yEnd2, box.vp2, "green", 1);
    drawLine(box.corner23, box.vp2, "green", 1);
    drawLine(box.backCorner, box.vp2, "green", 1);

    drawLine(box.corner13, box.vp3, "blue", 1);
    drawLine(box.yEnd3, box.vp3, "blue", 1);
    drawLine(box.corner23, box.vp3, "blue", 1);
    drawLine(box.backCorner, box.vp3, "blue", 1);
  }, [canvasRef, box]);

  return (
    <BoxGeneratorInner>
      <BoxCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight} />
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
