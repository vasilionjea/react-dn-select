import { DnSelectProps, Point, MultiIntent } from './types';
import { useRef, useMemo } from 'react';
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
  multi = false,
}: DnSelectProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRef<DOMRectReadOnly>();
  const selectBoxRef = useRef<HTMLDivElement>(null);
  const childNodes = useRef<Map<Item, HTMLElement | null>>(new Map());

  const multiIntent = useRef<MultiIntent | null>(null);
  const multiToggled = useRef(new Set<Item>());

  const { select, unselect, isSelected, getSelected, unselectAll } =
    useSelectable<Item>(initSelected);

  const OverlapStates = useMemo(
    () => ({
      singleSelect: {
        enter: (item: Item) => select(item),
        leave: (item: Item) => unselect(item),
      },

      multiSelect: {
        enter(item: Item) {
          // derive intent only once from the first overlapped item
          if (!multiIntent.current) {
            multiIntent.current = isSelected(item)
              ? MultiIntent.Unselect
              : MultiIntent.Select;
          }

          // toggle item once on first overlap (ignore subsequent mousemoves)
          if (!multiToggled.current.has(item)) {
            multiIntent.current === MultiIntent.Select
              ? select(item)
              : unselect(item);
            multiToggled.current.add(item);
          }
        },

        leave(item: Item) {
          // only unselect items during the current "drag session"
          if (multiToggled.current.has(item)) {
            unselect(item);
            multiToggled.current.delete(item);
          }
        },
      },
    }),
    [isSelected, select, unselect],
  );

  const selectOverlapping = throttle((selectBoxRect: DOMRectReadOnly) => {
    for (const [item, node] of childNodes.current) {
      // clear invalid refs (unmounted nodes)
      if (!node) {
        unselect(item);
        childNodes.current.delete(item);
      }

      const childRect = node?.getBoundingClientRect();
      const overlapping = isOverlapping(selectBoxRect, childRect);

      switch (overlapping) {
        case true:
          multi
            ? OverlapStates.multiSelect.enter(item)
            : OverlapStates.singleSelect.enter(item);
          break;

        case false:
          multi
            ? OverlapStates.multiSelect.leave(item)
            : OverlapStates.singleSelect.leave(item);
          break;
      }
    }
  }, throttleDelay);

  const drag = useDraggable({
    escapable: escapeKey,

    onStart() {
      if (multi) {
        multiIntent.current = null;
        multiToggled.current.clear();
        onDragStart?.(getSelected());
      } else {
        const prevSelected = unselectAll();
        onDragStart?.(prevSelected);
      }
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
      multiIntent.current = null;
      multiToggled.current.clear();
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
    <div
      ref={containerRef}
      onPointerDown={drag.start}
      className={`dn-select ${multi ? 'multi' : ''}`}
    >
      {children}
      <div ref={selectBoxRef} className="dn-select-box"></div>
    </div>
  );
}
