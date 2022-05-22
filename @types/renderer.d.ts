/** @format */

export interface magnifique_api {
  closeServer: () => void;
  minServerWindow: () => void;
  maxServerWindow: () => void;
  isElectron: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  networks: any[];
  request: (
    url: string,
    conf: import("axios").AxiosRequestConfig
  ) => Promise<import("axios").AxiosResponse>;
}
declare global {
  interface Window {
    magnifique: magnifique_api & {
      config: import("../packages/client/src/modules/config/config").config;
    };
  }
}
