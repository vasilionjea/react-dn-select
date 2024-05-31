import { DnSelectProps, Point, MultiIntent } from './types';
import { useState, useRef, useMemo, useCallback } from 'react';
import {
  noop,
  throttle,
  distance,
  calcRect,
  isOverlapping,
  showSelectBox,
  hideSelectBox,
  selectBoxHiddenStyles,
} from './utils';
import { useDraggable } from './useDraggable';
import { useSelectable } from './useSelectable';
import DnSelectItem from './DnSelectItem';

const CLASSES = {
  container: 'dn-select',
  selectBox: 'dn-select-box',
  multi: 'multi',
};

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
  dragThreshold = 1,
  multi: isMulti = false,
  initSelected = [],
  throttleDelay = 100,
  escapable = true,
  onEscape = noop,
}: DnSelectProps<Item>) {
  const containerRef = useRef<HTMLDivElement>(null);
  const containerRect = useRef<DOMRectReadOnly>();

  const selectBoxRef = useRef<HTMLDivElement>(null);

  const childNodes = useRef<Map<Item, HTMLElement | null>>(new Map());
  const childRects = useRef<Map<Item, DOMRect | undefined>>(new Map());

  const multiIntent = useRef<MultiIntent | null>(null);
  const multiToggled = useRef(new Set<Item>());

  const {
    select,
    unselect,
    unselectMany,
    isSelected,
    getSelected,
    clearSelected,
  } = useSelectable<Item>(initSelected);

  const [prevItems, setPrevItems] = useState(items);

  if (items !== prevItems) {
    const stales = getSelected().filter((sel) => !items.includes(sel));
    setPrevItems(items);
    unselectMany(stales);
  }

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

          // toggle item once during first enter (ignore subsequent pointermoves)
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

  const selectOverlapping = throttle(
    useCallback(
      (selectBoxRect: DOMRectReadOnly) => {
        for (const [item, node] of childNodes.current) {
          // clear invalid refs (unmounted nodes)
          if (!node) {
            unselect(item);
            childNodes.current.delete(item);
          }

          const childRect = childRects.current.get(item);
          const overlapping = isOverlapping(selectBoxRect, childRect);

          switch (overlapping) {
            case true:
              isMulti
                ? OverlapStates.multiSelect.enter(item)
                : OverlapStates.singleSelect.enter(item);
              break;

            case false:
              isMulti
                ? OverlapStates.multiSelect.leave(item)
                : OverlapStates.singleSelect.leave(item);
              break;
          }
        }
      },
      [
        isMulti,
        unselect,
        OverlapStates.singleSelect,
        OverlapStates.multiSelect,
      ],
    ),
    throttleDelay,
  );

  const updateRects = useCallback(() => {
    containerRect.current = containerRef.current?.getBoundingClientRect();
    childRects.current = new Map(
      [...childNodes.current].map(([item, node]) => [
        item,
        node?.getBoundingClientRect(),
      ]),
    );
  }, []);

  const { startDragging, stopDragging } = useDraggable({
    escapable,
    onEscape,

    onStart() {
      if (isMulti) {
        onDragStart?.(getSelected());
      } else {
        const prevSelected = clearSelected();
        onDragStart?.(prevSelected);
      }

      updateRects();
    },

    onMove(startPoint: Point, endPoint: Point) {
      // ignore subpixel movement
      if (distance(startPoint, endPoint) < dragThreshold) return;

      const parentRect = containerRect.current;
      const selectBoxRect = calcRect(startPoint, endPoint);

      showSelectBox(selectBoxRef.current, {
        width: selectBoxRect.width,
        height: selectBoxRect.height,
        left: selectBoxRect.left - (parentRect?.left ?? 0),
        top: selectBoxRect.top - (parentRect?.top ?? 0),
      });

      selectOverlapping(selectBoxRect);
      onDragMove?.(getSelected());
    },

    onEnd() {
      multiIntent.current = null;
      multiToggled.current.clear();
      hideSelectBox(selectBoxRef.current);
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
      onPointerDown={startDragging}
      onContextMenu={stopDragging}
      onPointerCancel={stopDragging}
      className={`${CLASSES.container} ${isMulti ? CLASSES.multi : ''}`}
      style={{ position: 'relative' }}
    >
      {children}
      <div
        ref={selectBoxRef}
        className={`${CLASSES.selectBox}`}
        style={{ ...selectBoxHiddenStyles }}
      ></div>
    </div>
  );
}
