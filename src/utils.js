export const toDegrees = (radians) => (radians * 180) / Math.PI;
export const toRadians = (degrees) => (degrees * Math.PI) / 180;

export const getRange = (length) => [...Array(length).keys()];
export const getRandomFrom = (...args) =>
  args[Math.floor(Math.random() * args.length)];
export const flatten = (arrays) =>
  arrays.reduce((acc, row) => [...acc, ...row], []);
export const withoutElement = (array, element) =>
  array.filter((e) => e !== element);
export const updateElement = (array, oldElement, newElement) =>
  array.map((e) => (e === oldElement ? newElement : e));

export const registerListener = (eventName, handler) => {
  window.addEventListener(eventName, handler);
  return () => window.removeEventListener(eventName, handler);
};
export const randomRange = (min, max) => {
  return min + Math.random() * (max - min);
};

// Captures 0x + 4 characters, then the last 4 characters.
const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

/**
 * Truncates an ethereum address to the format 0x0000…0000
 * @param address Full address to truncate
 * @returns Truncated address
 */
export const truncateEthAddress = (address) => {
  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
};
