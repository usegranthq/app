export const delay = (ms: number): Promise<void> => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

// if total time is less than minimumDelay, delay for the remainting time
// @param min - minimum delay in milliseconds
// @param initialTime - initial time in milliseconds
// @param currentTime - current time in milliseconds
export const minimumDelay = async (min: number, initialTime: number, currentTime: number): Promise<void> => {
  const totalTime = currentTime - initialTime;
  if (totalTime < min) {
    await delay(min - totalTime);
  }
};
