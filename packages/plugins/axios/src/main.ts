/** @format */
import type { AxiosRequestConfig, AxiosResponse } from "axios";
import axios from "axios";

export default function (
  url: string,
  conf: AxiosRequestConfig
): Promise<AxiosResponse["data"]> {
  return new Promise((resolve) => {
    let reqwest = "magnifique" in window ? window.magnifique.request : axios;
    if (import.meta.env.PROD) {
      // production
      let uri = new URL(location.href);
      uri.pathname = "/api/" + url;
      reqwest(uri.toString(), conf).then((response) => {
        resolve("magnifique" in window ? response : response.data);
      });
    } else {
      // development
      let uri = new URL("http://localhost/");
      uri.pathname = "/api/" + url;
      reqwest(uri.toString(), conf).then((response) => {
        resolve("magnifique" in window ? response : response.data);
      });
    }
  });
}
