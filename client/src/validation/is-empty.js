// Custom validator to check if empty
const isEmpty = value =>
  value === undefined ||
  value === null ||
  // Value is object and has no keys
  (typeof value === "object" && Object.keys(value).length === 0) ||
  // Value is a string, excludes blank spaces
  (typeof value === "string" && value.trim().length === 0);

export default isEmpty;
