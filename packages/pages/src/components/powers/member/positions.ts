/** @format */

export default navigator.language === "zh-CN"
  ? ([
      {
        name: "注册",
        value: "register",
      },
      {
        name: "干事",
        value: "clerk",
      },
      {
        name: "副部长",
        value: "vice-minister",
      },
      {
        name: "部长",
        value: "minister",
      },
      {
        name: "副主席",
        value: "vice-chairman",
      },
      {
        name: "主席",
        value: "chairman",
      },
    ] as Array<{
      name: string;
      value: string;
    }>)
  : ([
      {
        name: "Register",
        value: "register",
      },
      {
        name: "Clerk",
        value: "clerk",
      },
      {
        name: "Vice Minister",
        value: "vice-minister",
      },
      {
        name: "Minister",
        value: "minister",
      },
      {
        name: "Vice Chairman",
        value: "vice-chairman",
      },
      {
        name: "Chairman",
        value: "chairman",
      },
    ] as Array<{
      name: string;
      value: string;
    }>);
