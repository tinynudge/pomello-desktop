export const getFraction = (decimal: number): string | undefined => {
  const decimals: Record<number, string | undefined> = {
    0.125: '⅛',
    0.25: '¼',
    0.375: '⅜',
    0.5: '½',
    0.625: '⅝',
    0.75: '¾',
    0.875: '⅞',
  };

  return decimals[decimal];
};
