/** @format */

/**
 * @function fetchData
 * @param {URL} url
 * @param {RequestInit | undefined} data
 * @async
 * @returns {string}
 */
export async function fetchData(url, data) {
  const uri = url.toString();
  const resp = await fetch(uri, data);
  return await resp.text();
}
