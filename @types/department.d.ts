/** @format */

declare interface department {
  departments: Record<
    string,
    {
      name: string;
      duty: Array<"deduction" | "post" | "volunteer">;
      desc: string;
      classes?: {
        reason: string;
        deduction: number;
      }[];
      groups: Array<group>;
    }
  >;
}
