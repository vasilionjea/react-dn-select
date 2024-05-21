const genStrings = (size: number) => {
  const result = Array(size)
    .fill('')
    .map((_, i) => (Math.random() * (i + 1) * 10).toString(36).slice(4, 8));

  return Array.from(new Set(result));
};

export const names = genStrings(316);
