/** @format */

import { createRouter, RouteRecordRaw, createWebHistory } from "vue-router";
import Home from "../views/Home.vue";
import About from "../views/About.vue";
import Class from "../views/Class/Class.vue";
import ClassHome from "../views/Class/Home.vue";
import NotFound from "../views/NotFound.vue";
import MemberHome from "../views/Member/Home.vue";
import MemberDashboard from "../views/Member/Dashboard.vue";
import MemberDepartment from "../views/Member/Department.vue";
import MemberAdminHome from "../views/Member/admin/Home.vue";
import AdminHome from "../views/Admin/Home.vue";
import AdminData from "../views/Admin/Data.vue";
import AdminDepartments from "../views/Admin/DepartmentView.vue";
import Server from "../views/Server.vue";
import loginPortableVue from "../views/Member/login_portable.vue";

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login/",
    component: Home,
  },
  {
    path: "/login/:type",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    component: About,
  },
  {
    path: "/:pathMatch(.*)*",
    name: "404 - Page Not Found",
    component: NotFound,
  },
  {
    path: "/member",
    component: MemberHome,
    meta: {
      transition: "fade",
    },
    children: [
      {
        path: "",
        component: MemberDashboard,
        meta: {
          transition: "fade",
        },
      },
      {
        path: "/member/department/:type?",
        component: MemberDepartment,
        meta: {
          transition: "fade",
        },
      },
      {
        path: "/member/admin/:type?",
        component: MemberAdminHome,
        meta: {
          transition: "fade",
        },
      },
      {
        path: "/member/admin/:type/:status?",
        component: MemberAdminHome,
        meta: {
          transition: "fade",
        },
      },
    ],
  },
  {
    path: "/login/member/:id",
    component: loginPortableVue,
    meta: {
      transition: "fade",
    },
  },
  {
    path: "/class",
    name: "Class",
    component: Class,
    children: [
      {
        path: "home",
        component: ClassHome,
        meta: {
          transition: "fade",
        },
      },
      {
        path: "/class/home/:page?",
        component: ClassHome,
        meta: {
          transition: "fade",
        },
      },
      {
        path: "/class/home/member/:status?",
        component: ClassHome,
        meta: {
          transition: "fade",
        },
      },
    ],
  },
  {
    path: "/server",
    name: "Server",
    component: () => import("../views/Server.vue"),
  },
  {
    path: "/server",
    component: Server,
  },
  {
    path: "/admin",
    component: AdminHome,
    children: [
      {
        path: "/admin/data",
        component: AdminData,
        children: [
          {
            path: "/admin/data/:type",
            component: AdminData,
          },
          {
            path: "/admin/data/:type/info/:data",
            component: AdminData,
          },
          {
            path: "/admin/data/:type/:status/",
            component: AdminData,
          },
        ],
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
