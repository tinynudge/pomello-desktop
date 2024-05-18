export const createQueryRegex = (query: string) => {
  return new RegExp(query.split('').join('.*'), 'i');
};
