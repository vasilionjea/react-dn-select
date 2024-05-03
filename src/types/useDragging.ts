import { Point } from '.';

export type DragStartHandler = (arg1: Point) => void;
export type DragMoveHandler = (arg1: Point, arg2: Point) => void;
export type DragEndHandler = (arg1: Point, arg2: Point) => void;

export type UseDraggingProps = {
  onStart: DragStartHandler;
  onDrag: DragMoveHandler;
  onEnd: DragEndHandler;
};
