/** @format */

declare namespace DeductionFetch {
  export interface fetchAsClass {
    gradeid: number;
    classid: number;
    password: string;
    type: "class";
  }

  export interface fetchAsSingleMember {
    number: number;
    password: string;
    type: "member";
    name: string;
  }

  export interface fetchAsMemberAdmin {
    number: number;
    password: string;
    type: "member_admin";
  }

  export interface fetchAsAdmin {
    password: string;
    type: "admin";
  }

  export type fetcherOptions =
    | fetchAsAdmin
    | fetchAsClass
    | fetchAsMemberAdmin
    | fetchAsSingleMember;

  export interface deductionFetcherConfig {
    type: fetcherOptions["type"];
    getter: true;
    deleter: boolean;
    creater: boolean;
    url: string;
    standardConfig: fetcherOptions;
    name?: string;
  }
}
