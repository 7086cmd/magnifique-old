/** @format */

export default (e: unknown) => {
  return {
    status: "error",
    reason: "type-error",
    text: new Error(<string>e).message,
  };
};
