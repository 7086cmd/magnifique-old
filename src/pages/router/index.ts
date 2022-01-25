import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import ClassLogin from '../views/Class/ClassLogin.vue'
import Class from '../views/Class/Class.vue'
import ClassHome from '../views/Class/Home.vue'
import ClassChart from '../views/Class/Chart.vue'
import ClassList from '../views/Class/List.vue'
import ClassMember from '../views/Class/Member.vue'
import ClassMessage from '../views/Class/Message.vue'
import NotFound from '../views/NotFound.vue'
import MemberLogin from '../views/Member/Login.vue'
import MemberHome from '../views/Member/Home.vue'
import MemberDashboard from '../views/Member/Dashboard.vue'
import MemberInformation from '../views/Member/Information.vue'
import MemberWorkFlow from '../views/Member/WorkFlow.vue'
import MemberMessage from '../views/Member/Message.vue'
import MemberDepartment from '../views/Member/Department.vue'
import MemberAdminHome from '../views/Member/admin/Home.vue'
import AdminLogin from '../views/Admin/Login.vue'
import AdminHome from '../views/Admin/Home.vue'
import AdminData from '../views/Admin/Data.vue'
import AdminMember from '../views/Admin/Member.vue'
import Server from '../views/Server.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/about',
    name: 'About',
    component: About,
  },
  {
    path: '/:pathMatch(.*)*',
    name: '404 - Page Not Found',
    component: NotFound,
  },
  {
    path: '/class/login',
    component: ClassLogin,
    meta: {
      transition: 'fade',
    },
  },
  {
    path: '/member/login',
    component: MemberLogin,
    meta: {
      transition: 'fade',
    },
  },
  {
    path: '/member',
    component: MemberHome,
    meta: {
      transition: 'fade',
    },
    children: [
      {
        path: '',
        component: MemberDashboard,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'information',
        component: MemberInformation,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'department',
        component: MemberDepartment,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'workflow',
        component: MemberWorkFlow,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'message',
        component: MemberMessage,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'admin/',
        component: MemberAdminHome,
        meta: {
          transition: 'fade',
        },
      },
    ],
  },
  {
    path: '/class',
    name: 'Class',
    component: Class,
    children: [
      {
        path: 'home',
        component: ClassHome,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '',
        component: ClassHome,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'chart',
        component: ClassChart,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'list',
        component: ClassList,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'member',
        component: ClassMember,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: 'message',
        component: ClassMessage,
        meta: {
          transition: 'fade',
        },
      },
    ],
  },
  {
    path: '/server',
    name: 'Server',
    component: () => import('../views/Server.vue'),
  },
  {
    path: '/admin/login',
    component: AdminLogin,
  },
  {
    path: '/server',
    component: Server,
  },
  {
    path: '/admin',
    component: AdminHome,
    children: [
      {
        path: '/admin/data',
        component: AdminData,
      },
      {
        path: '/admin/member',
        component: AdminMember,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
