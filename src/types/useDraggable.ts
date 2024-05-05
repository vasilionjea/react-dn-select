import { Point } from '.';

export type DragStartHandler = (arg1: Point) => void;
export type DragMoveHandler = (arg1: Point, arg2: Point) => void;
export type DragEndHandler = (arg1: Point, arg2: Point) => void;

export type UseDraggableProps = {
  onStart: DragStartHandler;
  onMove: DragMoveHandler;
  onEnd: DragEndHandler;
};
