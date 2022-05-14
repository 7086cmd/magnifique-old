/** @format */

import { PatchRules } from "./member_datas/map";
import axios from "axios";
import baseurl from "../../../modules/baseurl";

/**
 * @type login
 * @public
 * The login (auth) field when requesting.
 */
export type login = (
  | { type: "member_admin"; number: number }
  | { type: "admin" }
) & {
  password: string;
};

/**
 * @class MemberClient
 */
export class MemberClient {
  /**
   * The `auth` field when requesting.
   * @var loginInfo
   */
  private loginInfo = {
    password: "",
    number: undefined as number | undefined,
  };
  /**
   * The API address.
   * @var {string} api
   */
  private api: string;
  /**
   * @constructor
   * @param {login} info login data
   */
  constructor(info: login) {
    this.loginInfo.password = info.password;
    this.loginInfo.number = info.type === "admin" ? undefined : info.number;
    this.api =
      baseurl + (info.type === "admin" ? "admin" : "member/admin") + "/member";
  }
  /**
   * Get the member list for (member) admins.
   * @async
   */
  async get() {
    return await axios(this.api, {
      params: {
        number: this.loginInfo.number,
      },
    });
  }
  /**
   * Add a member.
   * @param {member} member_info
   * @async
   */
  async post(member_info: member) {
    return await axios(this.api, {
      data: {
        auth: this.loginInfo,
        data: {
          member: member_info,
        },
      },
      method: "post",
    });
  }
  /**
   * Edit a member's position and department
   * @param {number} number the number of the member
   * @async
   */
  async put(number: number, content: PatchRules) {
    return await axios(this.api, {
      data: {
        auth: this.loginInfo,
        data: {
          person: number,
          patch: content.to_str(),
        },
      },
      method: "put",
    });
  }
  /**
   * Remark a member violated.
   * @param {number} number the number of the member
   * @async
   */
  async patch(number: number) {
    return await axios(this.api, {
      data: {
        auth: this.loginInfo,
        data: {
          person: number,
        },
      },
      method: "patch",
    });
  }
  /**
   * Delete a member.
   * @param {number} person the number of the person
   * @async
   */
  async delete(person: number) {
    return await axios(this.api, {
      data: {
        auth: this.loginInfo,
        data: {
          person: person,
        },
      },
      method: "delete",
    });
  }
}

export class MemberListClientForClass {
  private info: { gradeid: number; classid: number; password: string };
  /**
   * Auth when requesting.
   * @constructor
   * @param {number} gradeid 3 grades, year.
   * @param {number} classid the class order (1 - 15, default)
   * @param {string} password base-64 encrypted(...) password.
   */
  constructor(info: { gradeid: number; classid: number; password: string }) {
    this.info = info;
  }
  /**
   * Get Member List for A Class
   * @async
   */
  async get() {
    const resp = await axios(baseurl + "class/member", {
      params: {
        gradeid: this.info.gradeid,
        classid: this.info.classid,
      },
    });
    return resp;
  }
  /**
   * Register a member.
   * @param {member} member_info The Info of the registed member.
   * @async
   */
  async post(member_info: member) {
    return await axios(baseurl + "class/member", {
      data: {
        auth: this.info,
        data: {
          member: member_info,
        },
      },
      method: "post",
    });
  }
}

/**
 * @interface class_login
 * @public
 * @description login data struct type
 */
export interface class_login {
  gradeid: number;
  classid: number;
  password: string;
}
