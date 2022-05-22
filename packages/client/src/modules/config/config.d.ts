/** @format */

export interface config {
  version: string;
  server: {
    host: URL["host"];
    port: URL["port"];
  };
  user: {
    dark: boolean;
    mute: boolean;
    login: {
      direct: boolean;
      info?: {
        username: string /** class */ | "admin";
        password: string; // after encrypt
      };
    };
    panels: Array<"class" | "member" | "admin">;
  };
}
