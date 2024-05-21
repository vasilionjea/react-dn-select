import type { Point, AnyFunction, InlineStyleAttrs } from './types';

export const noop = () => {};

export const isString = (val: unknown) => typeof val === 'string';

export const isNumber = (val: unknown) => {
  return !Number.isNaN(val) && typeof val === 'number';
};

export const isFunction = (val: unknown) => typeof val === 'function';

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

export const generateStyle = (attrs: InlineStyleAttrs) => {
  if (!attrs) return '';

  return Object.entries(attrs)
    .map(([key, val]) => {
      if (isString(val)) {
        return `${key}:${val}`;
      } else if (isNumber(val)) {
        return `${key}:${val}px`;
      }
    })
    .join(';');
};

export const applyStyles = (elem: HTMLElement, attrs: InlineStyleAttrs) => {
  requestAnimationFrame(() => (elem.style.cssText = generateStyle(attrs)));
};

export const showSelectBox = (
  elem: HTMLElement | null,
  attrs: InlineStyleAttrs,
) => {
  if (!elem) return;
  applyStyles(elem, {
    ...attrs,
    'z-index': '99',
    position: 'absolute',
    opacity: '1',
  });
};

export const selectBoxHiddenStyles: InlineStyleAttrs = {
  position: 'absolute',
  opacity: '0',
};

export const hideSelectBox = (elem: HTMLElement | null) => {
  if (!elem) return;
  applyStyles(elem, { ...selectBoxHiddenStyles });
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
 * Given two points it returns the Euclidean distance.
 */
export const distance = (startPoint: Point, endPoint: Point) => {
  const x = endPoint[0] - startPoint[0];
  const y = endPoint[1] - startPoint[1];
  return Math.sqrt(x ** 2 + y ** 2);
};

/**
 * Given two rects it returns true if they overlap.
 */
export const isOverlapping = (
  box: DOMRectReadOnly | undefined,
  child: DOMRectReadOnly | undefined,
): boolean => {
  if (!box || !child) return false;

  const xOverlap = box.left <= child.right && box.right >= child.left;
  const yOverlap = box.top <= child.bottom && box.bottom >= child.top;

  if (xOverlap && yOverlap) return true;

  return false;
};
