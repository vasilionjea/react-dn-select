import type { Point, UseDraggableProps, UseDraggableReturn } from './types';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDraggable() hook
 */
export function useDraggable({
  onStart,
  onMove,
  onEnd,
}: UseDraggableProps): UseDraggableReturn {
  const [isDragging, setIsDragging] = useState(false);

  // Point refs
  const startPoint = useRef<Point>([0, 0]);
  const endPoint = useRef<Point>([0, 0]);

  // Callback refs - so we don't have to add them
  // as deps in event listeners below
  const onStartRef = useRef(onStart);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  const didDrag = useRef(false);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    setIsDragging(true);
    startPoint.current = [e.clientX, e.clientY];
    onStartRef.current?.(startPoint.current);
  }, []);

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      endPoint.current = [e.clientX, e.clientY];
      didDrag.current = true;

      onMoveRef.current?.(startPoint.current, endPoint.current);
    },
    [isDragging],
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);

    startPoint.current = [0, 0];
    endPoint.current = [0, 0];

    if (didDrag.current) {
      onEndRef.current?.(startPoint.current, endPoint.current);
      didDrag.current = false;
    }
  }, []);

  useEffect(() => {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };
  }, [onPointerMove, onPointerUp]);

  return onPointerDown;
}
