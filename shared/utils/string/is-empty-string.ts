const isEmptyString = (value: string | null | undefined) => {
  return !value || value.trim().length <= 0;
};

export default isEmptyString;
