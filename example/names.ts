const genStrings = (size: number) => {
  return Array(size)
    .fill('')
    .map((_, i) => (Math.random() * (i + 1) * 10).toString(36).slice(3, 7));
};

export const names = genStrings(130);
