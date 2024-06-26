export type Point = [number, number];

export type DnSelectProps<T> = {
  items: T[];
  itemId: (arg1: T) => string;
  renderItem: (arg1: { item: T; isSelected: boolean }) => JSX.Element;
  onDragStart?: (arg1: T[]) => void;
  onDragMove?: (arg1: T[]) => void;
  onDragEnd?: (arg1: T[]) => void;
  multi?: boolean;
  initSelected?: T[];
  throttleDelay?: number;
  dragThreshold?: number;
  escapable?: boolean;
  onEscape?: () => void;
};

export const enum MultiIntent {
  Select = 'select',
  Unselect = 'unselect',
}
