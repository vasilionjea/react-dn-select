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
  escapeKey = true,
}: DnSelectProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRef<DOMRectReadOnly>();
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const childNodes = useRef<Map<Item, HTMLElement | null>>(new Map());

  const { select, unselect, isSelected, getSelected, unselectAll } =
    useSelectable<Item>(initSelected);

  const selectOverlapping = throttle((selectBoxRect: DOMRectReadOnly) => {
    for (const [item, node] of childNodes.current) {
      // clear invalid refs (unmounted nodes)
      if (!node) {
        unselect(item);
        childNodes.current.delete(item);
      }

      const childRect = node?.getBoundingClientRect();

      if (childRect && isOverlapping(selectBoxRect, childRect)) {
        select(item);
      } else {
        unselect(item);
      }
    }
  }, throttleDelay);

  const drag = useDraggable({
    escapable: escapeKey,

    onStart() {
      const prev = unselectAll();
      onDragStart?.(prev);
      containerRect.current = containerRef.current?.getBoundingClientRect();
    },

    onMove(startPoint: Point, endPoint: Point) {
      const parentRect = containerRect.current;
      const selectBoxRect = calcRect(startPoint, endPoint);

      // ignore subpixel movement
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
      onDragMove?.(getSelected());
    },

    onEnd() {
      clearStyles(selectBoxRef.current);
      onDragEnd?.(getSelected());
    },
  });

  const children = items.map((item) => {
    return (
      <DnSelectItem
        key={itemId(item)}
        isSelected={isSelected(item)}
        ref={(node: HTMLElement | null) => childNodes.current.set(item, node)}
      >
        {renderItem({ item, isSelected: isSelected(item) })}
      </DnSelectItem>
    );
  });

  return (
    <div ref={containerRef} onPointerDown={drag.start} className="dn-select">
      {children}
      <div ref={selectBoxRef} className="dn-select-box"></div>
    </div>
  );
}
