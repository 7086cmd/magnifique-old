/** @format */

declare interface department {
  departments: Record<string, departmentItem>;
}

declare interface departmentItem {
  name: string;
  duty: Array<"deduction" | "post" | "volunteer">;
  desc: string;
  classes?: {
    reason: string;
    deduction: number;
  }[];
  groups: Array<group>;
}

type departmentList = Array<
  departmentItem & {
    id: string;
  }
>;
