export const trimInput = (value: string) =>
  value.replace(/^\s+|\s+$/g, "").replace(/\s+/g, " ");
