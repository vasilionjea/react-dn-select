import { useState, useCallback } from 'react';

/**
 * useSelectable() hook
 */
export function useSelectable<T>(initSelected = []) {
  const [selected, setSelected] = useState(() => new Set<T>(initSelected));

  const getSelected = useCallback(() => Array.from(selected), [selected]);

  const isSelected = useCallback((item: T) => selected.has(item), [selected]);

  const select = useCallback(
    (item: T) => {
      setSelected(new Set(selected.add(item)));
    },
    [selected],
  );

  const unselect = useCallback(
    (item: T) => {
      selected.delete(item);
      setSelected(new Set(selected));
    },
    [selected],
  );

  const unselectAll = useCallback(() => {
    const unselected = Array.from(selected);
    setSelected(new Set());
    return unselected;
  }, [selected]);

  return {
    select,
    unselect,
    isSelected,
    getSelected,
    unselectAll,
  };
}
