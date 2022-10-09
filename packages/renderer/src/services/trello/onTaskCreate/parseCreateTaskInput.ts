type CreateTaskParams = Record<CreateTaskParam, 'string'>;

type CreateTaskParam = 'desc' | 'labels' | 'list' | 'title';

const createTaskArguments: Record<string, CreateTaskParam> = {
  '#': 'labels',
  d: 'desc',
  l: 'list',
  t: 'title',
};

const paramsRegex = Object.entries(createTaskArguments).flat().join('|');

const textRegex = new RegExp(`(?=-(?:${paramsRegex})\\s)`);

const parseCreateTaskInput = (input: string): CreateTaskParams => {
  return input.split(textRegex).reduce((currentParams, text) => {
    const [, param, value] = text.match(/(?:-(\S+)\s)?(.+)/) ?? [];

    const normalizedParam = createTaskArguments[param] ?? param ?? createTaskArguments.t;

    return {
      ...currentParams,
      [normalizedParam]: value.trim(),
    };
  }, {} as CreateTaskParams);
};

export default parseCreateTaskInput;
