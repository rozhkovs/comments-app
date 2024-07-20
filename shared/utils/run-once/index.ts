const runOnce = <ResultT, ArgsT extends unknown[]>(
  load: (...args: ArgsT) => Promise<ResultT>,
) => {
  let cached: Promise<ResultT> | undefined;

  return async (...args: ArgsT) => {
    if (!cached) {
      const cached = load(...args);
      return await cached;
    }
    return await cached;
  };
};

export default runOnce;
