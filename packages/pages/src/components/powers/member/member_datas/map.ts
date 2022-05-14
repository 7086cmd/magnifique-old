/** @format */

import { ElNotification } from "element-plus";
import { VNode } from "vue";

/**
 * @interface PatchRuleDefine
 * @description the patch rule (object)
 * @argument {number} number the number of the member
 * @argument {'register' | 'clerk' | 'vice-minister' | 'minister' | 'vice-chairman' | 'chairman'} position the current position
 * @argument {string} department the current department.
 */
interface PatchRuleDefine {
  number: number;
  position:
    | "register"
    | "clerk"
    | "vice-minister"
    | "minister"
    | "vice-chairman"
    | "chairman";
  department: string;
}
/**
 * @class PatchRules
 * @description the patch rule (object)
 * @argument {number} number the number of the member
 * @argument {'register' | 'clerk' | 'vice-minister' | 'minister' | 'vice-chairman' | 'chairman'} position the current position
 * @argument {string} department the current department.
 * @function to_str convert the rule to string
 * @function to_obj convert the rule to object
 */
export class PatchRules {
  /**
   * @argument {number} number
   * @private
   * @description the member number who is edited.
   */
  private number: number;
  /**
   * @argument {'register' | 'clerk' | 'vice-minister' | 'minister' | 'vice-chairman' | 'chairman'} position
   * @private
   * @description the current position after edit.
   */
  private position:
    | "register"
    | "clerk"
    | "vice-minister"
    | "minister"
    | "vice-chairman"
    | "chairman";
  /**
   * @argument {string} department
   * @private
   * @description the current department after edit.
   */
  private department: string;
  /**
   * @constructor
   * @param {PatchRuleDefine} rule the rule for generate a patch
   */
  constructor(rule: PatchRuleDefine) {
    this.number = rule.number;
    this.position = rule.position;
    this.department = rule.department;
  }
  to_str() {
    return `patch | ${this.number} -> (${this.department}_${this.position})`;
  }
  to_obj() {
    return {
      number: this.number,
      department: this.department,
      position: this.position,
    };
  }
}

/**
 * @var {Array<PatchRules>} patches
 * @public
 * @description the store for the patches
 */
export let patches = [] as Array<PatchRules>;

/**
 * @function Notificator
 * @public
 * @description the notification sender of the handler
 * @param {string} message the message body of the tip
 * @param {'warning' | 'success' | 'info' | 'error'} type the message type.
 */
export function Notificator(
  message: VNode | string,
  type?: "warning" | "success" | "info" | "error"
) {
  ElNotification({
    message,
    title: "操作失败",
    type: type ?? "error",
  });
}
