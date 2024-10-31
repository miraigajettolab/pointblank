import React, { useEffect, useRef, useState } from "react";
import { BoxCanvas, BoxControls, BoxGeneratorInner, BoxTitle, ControlButton, Footnote } from "./inner";
import { BoxData, Point, generateBoxData } from "./util";

enum States {
  PlaceFrontPoint,
  PlaceBackPoint,
  CheckResults,
  CheckResultsWithVanishingPoints,
}

const RESULT_STATES = [States.CheckResults, States.CheckResultsWithVanishingPoints];

const BoxGenerator: React.FC = () => {
  const canvasHeight = window.innerHeight;
  const canvasWidth = window.innerWidth;
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [box, setBox] = useState<BoxData>(generateBoxData(canvasWidth, canvasHeight));
  const [state, setState] = useState(States.PlaceFrontPoint);
  const [frontPoint, setFrontPoint] = useState<Point | null>(null);
  const [backPoint, setBackPoint] = useState<Point | null>(null);

  const handleReset = () => {
    setBox(generateBoxData(canvasWidth, canvasHeight));
    setState(States.PlaceFrontPoint);
    setFrontPoint(null);
    setBackPoint(null);
  };

  useEffect(() => {
    const context = canvasRef.current?.getContext("2d");
    if (!context) {
      return;
    }

    context.clearRect(0, 0, context.canvas.width, context.canvas.height);

    const drawPoint = (point: Point, color: string = "black", radius = 3) => {
      context.beginPath();
      context.arc(point.x, point.y, radius, 0, 2 * Math.PI);
      context.fillStyle = color;
      context.fill();
    };

    const drawLine = (
      start: Point,
      end: Point,
      color: string = "black",
      width = 3,
      drawPoints = true,
      dashed = false
    ) => {
      if (drawPoints) {
        drawPoint(start, color);
        drawPoint(end, color);
      }

      if (dashed) {
        context.setLineDash([width * 2, width * 2]);
      } else {
        context.setLineDash([]);
      }

      context.strokeStyle = color;
      context.lineWidth = width;
      context.beginPath();
      context.moveTo(start.x, start.y);
      context.lineTo(end.x, end.y);
      context.stroke();
    };

    if (RESULT_STATES.includes(state)) {
      if (state === States.CheckResultsWithVanishingPoints) {
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
      }

      drawLine(box.yEnd2, box.corner23);
      drawLine(box.yEnd3, box.corner23);

      drawLine(box.corner13, box.backCorner);
      drawLine(box.corner12, box.backCorner);
      drawLine(box.corner23, box.backCorner);

      if (frontPoint !== null) {
        drawLine(box.corner23, frontPoint, "blue", 1, false, true);
      }

      if (backPoint !== null) {
        drawLine(box.backCorner, backPoint, "red", 1, false, true);
      }
    }

    drawLine(box.frontCorner, box.yEnd1);
    drawLine(box.frontCorner, box.yEnd2);
    drawLine(box.frontCorner, box.yEnd3);

    drawLine(box.yEnd1, box.corner12);
    drawLine(box.yEnd2, box.corner12);

    drawLine(box.yEnd1, box.corner13);
    drawLine(box.yEnd3, box.corner13);

    if (frontPoint !== null) {
      drawPoint(frontPoint, "blue");
    }

    if (backPoint !== null) {
      drawPoint(backPoint, "red");
    }
  }, [canvasRef, box, state, frontPoint, backPoint]);

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (canvasRef.current === null) {
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const point: Point = { x: event.clientX - rect.left, y: event.clientY - rect.top };

    if (state === States.PlaceFrontPoint) {
      setFrontPoint(point);

      if (backPoint === null) {
        setState(States.PlaceBackPoint);
      }
    } else if (state === States.PlaceBackPoint) {
      setBackPoint(point);

      if (frontPoint === null) {
        setState(States.PlaceFrontPoint);
      }
    }
  };

  const getTitle = (): string => {
    switch (state) {
      case States.PlaceFrontPoint:
        return "Setting the Front Corner";
      case States.PlaceBackPoint:
        return "Setting the Back Corner";
      case States.CheckResults:
        return "Results:";
      case States.CheckResultsWithVanishingPoints:
        return "Results with VPs:";
    }
  };

  return (
    <BoxGeneratorInner>
      <BoxTitle>{getTitle()}</BoxTitle>
      <BoxCanvas ref={canvasRef} width={canvasWidth} height={canvasHeight} onClick={handleCanvasClick} />
      <BoxControls>
        <ControlButton disabled={RESULT_STATES.includes(state)} onClick={() => setState(States.PlaceFrontPoint)}>
          Place Front
        </ControlButton>
        <ControlButton disabled={RESULT_STATES.includes(state)} onClick={() => setState(States.PlaceBackPoint)}>
          Place Back
        </ControlButton>
        <ControlButton
          disabled={frontPoint === null || backPoint === null}
          onClick={() =>
            setState(
              state === States.CheckResultsWithVanishingPoints
                ? States.CheckResults
                : States.CheckResultsWithVanishingPoints
            )
          }
        >
          {(() => {
            if (state === States.CheckResultsWithVanishingPoints) {
              return "Hide VPs";
            } else if (state === States.CheckResults) {
              return "Show VPs";
            } else {
              return "Check";
            }
          })()}
        </ControlButton>
        <ControlButton onClick={handleReset}>Reset</ControlButton>
      </BoxControls>
      <Footnote>
        <a href="https://github.com/miraigajettolab/pointblank">github</a>
      </Footnote>
    </BoxGeneratorInner>
  );
};

export default BoxGenerator;
