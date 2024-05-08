import type { UseDraggableProps, Point } from './types';
import React, { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useDraggable() hook
 */
export function useDraggable(
  elemRef: React.RefObject<HTMLElement>,
  { onStart, onMove, onEnd }: UseDraggableProps,
) {
  const [isDragging, setIsDragging] = useState(false);

  // Point refs
  const startPoint = useRef<Point>([0, 0]);
  const endPoint = useRef<Point>([0, 0]);

  // Callback refs - so we don't have to add them
  // as deps in event listeners below
  const onStartRef = useRef(onStart);
  const onMoveRef = useRef(onMove);
  const onEndRef = useRef(onEnd);

  const handlePointerDown = useCallback((e: PointerEvent) => {
    setIsDragging(true);
    startPoint.current = [e.clientX, e.clientY];
    onStartRef.current?.(startPoint.current);
  }, []);

  const handlePointerMove = useCallback(
    (e: PointerEvent) => {
      if (!isDragging) return;
      endPoint.current = [e.clientX, e.clientY];
      onMoveRef.current?.(startPoint.current, endPoint.current);
    },
    [isDragging],
  );

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
    startPoint.current = [0, 0];
    endPoint.current = [0, 0];
    onEndRef.current?.(startPoint.current, endPoint.current);
  }, []);

  useEffect(() => {
    const elem = elemRef.current;
    elem?.addEventListener('pointerdown', handlePointerDown);
    return () => elem?.removeEventListener('pointerdown', handlePointerDown);
  }, [handlePointerDown]); // eslint-disable-line react-hooks/exhaustive-deps -- refs don't change

  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove);
    document.addEventListener('pointerup', handlePointerUp);

    return () => {
      document.removeEventListener('pointermove', handlePointerMove);
      document.removeEventListener('pointerup', handlePointerUp);
    };
  }, [handlePointerMove, handlePointerUp]);

  return [isDragging];
}
