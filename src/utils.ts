export const getTwoRandomIntsInRange = (min: number, max: number): number[] => {
  const nums = new Set();
  while (nums.size !== 2) {
    nums.add(Math.floor(Math.random() * (max - min + 1) + min));
  }

  return [...nums] as number[];
};
