const sillyClone = (obj: unknown) => {
  return JSON.parse(JSON.stringify(obj));
};

export default sillyClone;
