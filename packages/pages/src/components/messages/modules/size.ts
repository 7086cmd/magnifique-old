/** @format */

export const calculateSize = (size: number) => {
  if (size < (2 ** 10 * 3) / 4) return size + "字节";
  else if (size < (2 ** 20 * 3) / 4) return (size / 2 ** 10).toFixed(1) + "KiB";
  else if (size < (2 ** 30 * 3) / 4) return (size / 2 ** 20).toFixed(2) + "MiB";
  if (size < (2 ** 40 * 3) / 4) return (size / 2 ** 30).toFixed(3) + "GiB";
  else return (size / 2 ** 40).toFixed(4) + "TiB";
};
