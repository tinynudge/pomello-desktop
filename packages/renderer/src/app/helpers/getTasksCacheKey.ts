const getTasksCacheKey = (serviceId: string): string => {
  return `${serviceId}-tasks`;
};

export default getTasksCacheKey;
