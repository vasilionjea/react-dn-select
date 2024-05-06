import { Point, AnyFunction } from './types';

export const noop = () => {};

export const isNumber = (val: unknown) => typeof val === 'number';

export function isFunction(obj: unknown) {
  return typeof obj === 'function';
}

export function throttle<T>(fn: AnyFunction<T>, delay = 0): AnyFunction<T> {
  if (!isFunction(fn)) return noop;

  let wasCalled = false;

  return (...args) => {
    if (!wasCalled) {
      wasCalled = true;
      fn?.(...args);
    }

    setTimeout(() => {
      wasCalled = false;
    }, delay);
  };
}

export const applyStyles = (
  elem: HTMLElement | null,
  config: { [key: string]: unknown },
) => {
  if (!elem) return;

  let str = '';

  for (const [key, val] of Object.entries(config)) {
    const value = isNumber(val) ? `${val}px` : val;
    str += `${key}:${value};`;
  }

  requestAnimationFrame(() => (elem.style.cssText = str));
};

export const clearStyles = (elem: HTMLElement | null) => {
  if (!elem) return;
  requestAnimationFrame(() => (elem.style.cssText = ''));
};

/**
 * Given two mouse positions calculates a DOM rect.
 */
export const calcRect = (
  startPoint: Point,
  endPoint: Point,
): DOMRectReadOnly => {
  const left = Math.min(startPoint[0], endPoint[0]);
  const top = Math.min(startPoint[1], endPoint[1]);

  const [width, height] = [
    Math.abs(endPoint[0] - startPoint[0]),
    Math.abs(endPoint[1] - startPoint[1]),
  ];

  return DOMRect.fromRect({
    x: left,
    y: top,
    width,
    height,
  }).toJSON();
};

/**
 * Given two rects it returns true if they overlap.
 */
export const isOverlapping = (box: DOMRectReadOnly, child: DOMRectReadOnly) => {
  if (
    box.left <= child.right &&
    box.right >= child.left &&
    box.top <= child.bottom &&
    box.bottom >= child.top
  ) {
    return true;
  }

  return false;
};
