type ParseTaskName = {
  name: string;
  pomodoroCount: number;
};

const fractionMap: Record<string, string> = {
  '⅛': '.125',
  '¼': '.25',
  '⅜': '.375',
  '½': '.5',
  '⅝': '.625',
  '¾': '.75',
  '⅞': '.875',
};

export const parseTaskName = (name: string, marker: string): ParseTaskName => {
  const regex = new RegExp(`(?:([\\d\\.⅛|¼|⅜|½|⅝|¾|⅞]+)?\\s${marker})?(.+)`);
  const results = name.match(regex);

  if (!results) {
    return {
      pomodoroCount: 0,
      name,
    };
  }

  const [, checks = '0', parsedName] = results;

  const formattedChecks = checks.replace(/(⅛|¼|⅜|½|⅝|¾|⅞)/, fraction => fractionMap[fraction]);
  const pomodoroCount = parseFloat(formattedChecks);

  return {
    pomodoroCount,
    name: parsedName.trim(),
  };
};
