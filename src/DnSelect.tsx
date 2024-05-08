import type { DnSelectProps, Point } from './types';
import { useRef } from 'react';
import {
  throttle,
  calcRect,
  isOverlapping,
  applyStyles,
  clearStyles,
} from './utils';
import { useDraggable } from './useDraggable';
import { useSelectable } from './useSelectable';
import DnSelectItem from './DnSelectItem';

/**
 * <DnSelect />
 */
export default function DnSelect<Item>({
  items,
  itemId,
  renderItem,
  onDragStart,
  onDragMove,
  onDragEnd,
  initSelected = [],
  throttleDelay = 100,
}: DnSelectProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRef<DOMRectReadOnly>();
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const childNodes = useRef<Map<Item, HTMLElement>>(new Map());
  const didDrag = useRef(false);

  const { select, unselect, isSelected, getSelected, unselectAll } =
    useSelectable<Item>(initSelected);

  const selectOverlapping = throttle((selectBoxRect: DOMRectReadOnly) => {
    for (const [item, node] of childNodes.current) {
      const childRect = node?.getBoundingClientRect();
      if (childRect && isOverlapping(selectBoxRect, childRect)) {
        select(item);
      } else {
        unselect(item);
      }
    }
  }, throttleDelay);

  useDraggable(containerRef, {
    onStart() {
      onDragStart?.(unselectAll());
      containerRect.current = containerRef.current?.getBoundingClientRect();
    },

    onMove(startPoint: Point, endPoint: Point) {
      const parentRect = containerRect.current;
      const selectBoxRect = calcRect(startPoint, endPoint);

      // ignore sub-pixel movement
      if (
        Math.floor(selectBoxRect.width) === 0 ||
        Math.floor(selectBoxRect.height) === 0
      ) {
        return;
      }

      applyStyles(selectBoxRef.current, {
        width: selectBoxRect.width,
        height: selectBoxRect.height,
        left: selectBoxRect.left - (parentRect?.left ?? 0),
        top: selectBoxRect.top - (parentRect?.top ?? 0),
        opacity: '1',
      });

      selectOverlapping(selectBoxRect);
      didDrag.current = true;

      onDragMove?.(getSelected());
    },

    onEnd() {
      if (!didDrag.current) return;
      clearStyles(selectBoxRef.current);
      didDrag.current = false;
      onDragEnd?.(getSelected());
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
