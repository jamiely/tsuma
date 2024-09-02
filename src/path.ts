import { Node, Point, WaypointPath } from "./types";

export const createWaypointPath = (startPt: Point, endPt: Point): WaypointPath => {
  const start: Node<Point> = {value: startPt};
  const end: Node<Point> = {value: endPt, previous: start};

  start.next = end;

  return {
    start,
    end,
  }
};
