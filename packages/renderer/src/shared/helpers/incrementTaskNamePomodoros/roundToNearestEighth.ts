const roundToNearestEighth = (number: number): number => {
  const decimals = [0.125, 0.25, 0.375, 0.5, 0.625, 0.75, 0.875, 1];

  return decimals.reduce((closestEighth, decimal) => {
    const isCloser = Math.abs(decimal - number) < Math.abs(closestEighth - number);

    return isCloser ? decimal : closestEighth;
  });
};

export default roundToNearestEighth;
