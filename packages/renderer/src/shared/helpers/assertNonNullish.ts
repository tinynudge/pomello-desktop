// Must be a named function: https://github.com/microsoft/TypeScript/issues/34523
function assertNonNullish<TValue>(
  value: TValue,
  message: string
): asserts value is NonNullable<TValue> {
  if (value === null || value === undefined) {
    throw Error(message);
  }
}

export default assertNonNullish;
