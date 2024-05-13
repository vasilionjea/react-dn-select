import { Point } from '.';

export type DragStartHandler = (arg1: Point) => void;
export type DragMoveHandler = (arg1: Point, arg2: Point) => void;
export type DragEndHandler = (arg1: Point, arg2: Point) => void;
export type DragEscapeHandler = () => void;

export type UseDraggableProps = {
  escapable?: boolean;
  onStart: DragStartHandler;
  onMove: DragMoveHandler;
  onEnd: DragEndHandler;
  onEscape: DragEscapeHandler;
};

export type StartDragFn = (e: React.PointerEvent) => void;
export type StopDragFn = () => void;

export type UseDraggableReturn = {
  isDragging: boolean;
  start: StartDragFn;
  stop: StopDragFn;
};
