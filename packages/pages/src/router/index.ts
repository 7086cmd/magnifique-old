import { createRouter, RouteRecordRaw, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import About from '../views/About.vue'
import Class from '../views/Class/Class.vue'
import ClassHome from '../views/Class/Home.vue'
import ClassChart from '../views/Class/Chart.vue'
import ClassList from '../views/Class/List.vue'
import ClassMessage from '../views/Class/Message.vue'
import NotFound from '../views/NotFound.vue'
import MemberHome from '../views/Member/Home.vue'
import MemberDashboard from '../views/Member/Dashboard.vue'
import MemberMessage from '../views/Member/Message.vue'
import MemberDepartment from '../views/Member/Department.vue'
import MemberAdminHome from '../views/Member/admin/Home.vue'
import AdminHome from '../views/Admin/Home.vue'
import AdminData from '../views/Admin/Data.vue'
import AdminMessage from '../views/Admin/Message.vue'
import Server from '../views/Server.vue'
import MessagesHome from '../views/Messages/Index.vue'
import loginPortableVue from '../views/Member/login_portable.vue'

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
        path: '/member/department/:type?',
        component: MemberDepartment,
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
        path: '/member/message/room/:id',
        component: MemberMessage,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/member/message/:status?',
        component: MemberMessage,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/member/admin/:type?',
        component: MemberAdminHome,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/member/admin/:type/:status?',
        component: MemberAdminHome,
        meta: {
          transition: 'fade',
        },
      },
    ],
  },
  {
    path: '/login/member/:id',
    component: loginPortableVue,
    meta: {
      transition: 'fade',
    },
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
        path: '/class/list',
        component: ClassList,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/class/list/:page?',
        component: ClassList,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/class/list/member/:status?',
        component: ClassList,
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
      {
        path: '/class/message/room/:id',
        component: ClassMessage,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/class/message/:status?',
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
        children: [
          {
            path: '/admin/data/:type',
            component: AdminData,
          },
          {
            path: '/admin/data/:type/info/:data',
            component: AdminData,
          },
          {
            path: '/admin/data/:type/:status/',
            component: AdminData,
          },
        ],
      },
      {
        path: '/admin/message/:status?',
        component: AdminMessage,
        meta: {
          transition: 'fade',
        },
      },
      {
        path: '/admin/message/room/:id',
        component: AdminMessage,
        meta: {
          transition: 'fade',
        },
      },
    ],
  },
  {
    path: '/messages',
    component: MessagesHome,
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
