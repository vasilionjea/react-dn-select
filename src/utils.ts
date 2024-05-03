import { Point, ClientRect, AnyFunction } from './types';

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

/**
 * Given two mouse positions it calculates a rect.
 */
export const calcRect = (startPoint: Point, endPoint: Point) => {
  const left = Math.min(startPoint[0], endPoint[0]);
  const top = Math.min(startPoint[1], endPoint[1]);

  const [width, height] = [
    Math.abs(endPoint[0] - startPoint[0]),
    Math.abs(endPoint[1] - startPoint[1]),
  ];

  return { left, top, width, height };
};

/**
 * Given two rects it returns true if they overlap.
 */
export const isOverlapping = (box: ClientRect, child: ClientRect) => {
  const boxRight = box.left + box.width;
  const boxBottom = box.top + box.height;
  const childRight = child.left + child.width;
  const childBottom = child.top + child.height;

  if (
    box.left <= childRight &&
    boxRight >= child.left &&
    box.top <= childBottom &&
    boxBottom >= child.top
  ) {
    return true;
  }

  return false;
};
