/** @format */

declare interface member {
  name: string;
  number: number;
  youth: "none" | "training" | "pre" | "formal";
  volunteer: {
    time: number;
    details: Record<string, volunteer>;
  };
  deduction: {
    total: number;
    details: Record<string, deduction>;
  };
  post?: {
    total: number;
    details: Record<string, post>;
  };
  workflow: {
    total: number;
    details: Record<string, workflow>;
  };
  messageRooms: string[];
  union: {
    leader: boolean;
    position:
      | "chairman"
      | "vice-chairman"
      | "minister"
      | "vice-minister"
      | "clerk"
      | "register"
      | "none";
    duty: ("deduction" | "post" | "radio" | "volunteer")[];
    admin: (
      | "deduction"
      | "post"
      | "radio"
      | "volunteer"
      | "member"
      | "member-volunteer"
    )[];
    view: ("deduction" | "post" | "radio" | "volunteer" | "member")[];
    department: string;
    regist: {
      plan: string;
      prize: string;
      position: string;
      introduce: string;
    };
    group: string; // 组编号
  };
  record: {
    actions: number;
    score: number;
    violation: number;
  };
  password: string;
}
