import { useRef } from 'react';
import {
  applyStyles,
  calcRect,
  getEmptyRect,
  isOverlapping,
  throttle,
} from './utils';
import { useDragging } from './useDragging';
import { useSelect } from './useSelect';
import DnSelectItem from './DnSelectItem';

import { DnSelectProps, ClientRect, Point } from './types';

/**
 * DnSelect
 */
export default function DnSelect<Item>({
  items,
  itemId,
  renderItem,
  onChange,
  throttleDelay = 100,
}: DnSelectProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRef<ClientRect>(getEmptyRect());
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const childNodes = useRef(new Map());
  const didDrag = useRef(false);

  const { select, unselect, isSelected, getSelected, unselectAll } =
    useSelect<Item>();

  const selectOverlapping = throttle((selectBoxRect: ClientRect) => {
    for (const [item, node] of childNodes.current) {
      const childRect = node?.getBoundingClientRect() as ClientRect;
      if (childRect && isOverlapping(selectBoxRect, childRect)) {
        select(item);
      } else {
        unselect(item);
      }
    }
  }, throttleDelay);

  useDragging(containerRef, {
    onStart() {
      unselectAll();
      containerRect.current =
        containerRef.current?.getBoundingClientRect() as ClientRect;
      onChange?.([]);
    },

    onDrag(startPoint: Point, endPoint: Point) {
      const parentRect = containerRect.current;
      const selectBoxRect = calcRect(startPoint, endPoint);

      applyStyles(selectBoxRef.current, {
        ...selectBoxRect,
        left: selectBoxRect.left - parentRect.left,
        top: selectBoxRect.top - parentRect.top,
        opacity: '1',
      });

      selectOverlapping(selectBoxRect);
      didDrag.current = true;
    },

    onEnd() {
      if (!didDrag.current) return;
      applyStyles(selectBoxRef.current, {
        ...calcRect([0, 0], [0, 0]),
        opacity: '0',
      });
      didDrag.current = false;
      onChange?.(getSelected());
    },
  });

  const children = items.map((item) => {
    return (
      <DnSelectItem
        key={itemId(item)}
        isSelected={isSelected(item)}
        ref={(node: HTMLElement | null) => {
          if (node) childNodes.current.set(item, node); // mount
          else childNodes.current.delete(item); // unmount
        }}
      >
        {renderItem({ item, isSelected: isSelected(item) })}
      </DnSelectItem>
    );
  });

  return (
    <div ref={containerRef} className="dn-select">
      {children}
      <div ref={selectBoxRef} className="dn-select-box"></div>
    </div>
  );
}
