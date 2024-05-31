import { useState, useCallback } from 'react';

/**
 * useSelectable() hook
 */
export function useSelectable<T>(initSelected: T[] = []) {
  const [selected, setSelected] = useState(() => new Set<T>(initSelected));

  const getSelected = useCallback(() => Array.from(selected), [selected]);

  const isSelected = useCallback((item: T) => selected.has(item), [selected]);

  const select = useCallback(
    (item: T) => {
      if (isSelected(item)) return;
      setSelected(new Set(selected.add(item)));
    },
    [selected, isSelected],
  );

  const unselect = useCallback(
    (item: T) => {
      if (!isSelected(item)) return;
      selected.delete(item);
      setSelected(new Set(selected));
    },
    [selected, isSelected],
  );

  const unselectMany = useCallback(
    (items: T[]) => {
      if (!items?.length) return;
      items.forEach((item: T) => selected.delete(item));
      setSelected(new Set(selected));
    },
    [selected],
  );

  const clearSelected = useCallback(() => {
    const unselected = Array.from(selected);
    if (unselected.length) setSelected(new Set());
    return unselected;
  }, [selected]);

  return {
    select,
    unselect,
    unselectMany,
    isSelected,
    getSelected,
    clearSelected,
  };
}
