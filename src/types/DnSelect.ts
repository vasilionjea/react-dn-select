export type Point = [number, number];

export type DnSelectProps<T> = {
  items: T[];
  itemId: (arg1: T) => string;
  renderItem: (arg1: { item: T; isSelected: boolean }) => JSX.Element;
  onChange?: (arg1: T[]) => void;
  throttleDelay?: number;
};
