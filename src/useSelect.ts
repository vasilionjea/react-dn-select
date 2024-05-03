import { useState } from 'react';

/**
 * useSelect hook
 */
export function useSelect<T>(initSelected = []) {
  const [selected, setSelected] = useState(() => new Set<T>(initSelected));

  const getSelected = () => Array.from(selected);

  const isSelected = (item: T) => selected.has(item);

  const select = (item: T) => {
    setSelected(new Set(selected.add(item)));
  };

  const unselect = (item: T) => {
    selected.delete(item);
    setSelected(new Set(selected));
  };

  const unselectAll = () => {
    const prevSelected = Array.from(selected);
    setSelected(new Set());
    return prevSelected;
  };

  return {
    select,
    unselect,
    isSelected,
    getSelected,
    unselectAll,
  };
}
