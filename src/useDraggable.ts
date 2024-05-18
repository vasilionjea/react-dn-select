import type { Point, UseDraggableProps, UseDraggableReturn } from './types';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDraggable() hook
 */
export function useDraggable({
  onStart,
  onMove,
  onEnd,
  escapable,
  onEscape,
}: UseDraggableProps): UseDraggableReturn {
  const [isDragging, setIsDragging] = useState(false);

  const startPoint = useRef<Point>([0, 0]);
  const endPoint = useRef<Point>([0, 0]);
  const didDrag = useRef(false);

  const onPointerDown = useCallback(
    (e: React.PointerEvent) => {
      setIsDragging(true);
      startPoint.current = [e.clientX, e.clientY];
      onStart?.(startPoint.current);
    },
    [onStart],
  );

  const onPointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;

      endPoint.current = [e.clientX, e.clientY];
      didDrag.current = true;

      onMove?.(startPoint.current, endPoint.current);
    },
    [isDragging, onMove],
  );

  const onPointerUp = useCallback(() => {
    setIsDragging(false);

    startPoint.current = [0, 0];
    endPoint.current = [0, 0];

    if (didDrag.current) {
      onEnd?.(startPoint.current, endPoint.current);
      didDrag.current = false;
    }
  }, [onEnd]);

  const onKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (!escapable || !isDragging) return;
      if (e.key !== 'Escape') return;
      onPointerUp();
      onEscape?.();
    },
    [escapable, isDragging, onPointerUp, onEscape],
  );

  useEffect(() => {
    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onPointerMove, onPointerUp, onKeyDown]);

  return {
    isDragging,
    start: onPointerDown,
    stop: onPointerUp,
  };
}
