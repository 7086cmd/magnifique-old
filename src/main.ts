// import based-on dependences
import { resolve } from 'path'
import { readFileSync } from 'fs'
import { URLSearchParams } from 'url'
import { createServer } from 'http'
import { tmpdir } from 'os'
import { v4 as generateToken, v4 } from 'uuid'
import { encode as encodeGBK } from 'iconv-lite'
import { app, BrowserWindow, ipcMain, screen, Tray, Menu } from 'electron'
// import server dependences
import Koa from 'koa'
import KoaRouter from '@koa/router'
import koaCors from '@koa/cors'
import koaStatic from 'koa-static'
import koaBodyparser from 'koa-bodyparser'
import koaMulter, { diskStorage } from '@koa/multer'
import { Server } from 'socket.io'
// import database dependences
import { parse } from 'json5'
// import self-defingning database tool
import dbCreate from './modules/database/db-create'
import { writeData, readData } from './modules/database/config'
import getDepartmentData from './modules/database/get-department-data'
// import class productions
import loginClass from './modules/class/login-class'
import getContentClass from './modules/class/get-content-class'
import getMembers from './modules/class/get-members'
import fbNew from './modules/class/fb-new'
import chartClassDate from './modules/class/graphapi/date'
import chartClassPerson from './modules/class/graphapi/person'
import chartClassReason from './modules/class/graphapi/reason'
import getMembersPre from './modules/class/get-members-pre'
// import admin productions
import loginAdmin from './modules/admin/login-admin'
import getAllDeductions from './modules/admin/get-all-deductions'
import memberInformationProcess from './modules/admin/member-information-process'
import processAllMemberInfo from './modules/admin/process-all-member-info'
import addDeduction from './modules/admin/add-deduction'
import delDeduction from './modules/admin/del-deduction'
import delMember from './modules/admin/del-member'
import addMember from './modules/admin/add-member'
import deductionExportReason from './modules/admin/deduction-export-reason'
import getClassTotal from './modules/admin/get-class-total'
import getCoreMember from './modules/admin/get-core-member'
import addMemberPre from './modules/admin/add-member-pre'
import getAllMembers from './modules/admin/get-all-members'
import moveToRelMember from './modules/admin/move-to-rel-member'
import getDepartmentMember from './modules/admin/get-department-member'
import resetPassword from './modules/admin/reset-password'
// import utils
import objectToArray from './modules/utils/object-to-array'
import decodeBase64 from './modules/utils/decode-base64'
import editPassword from './modules/class/edit-password'
import fbNewE from './modules/utils/fb-new-e'
import getMemberInf from './modules/utils/get-member-inf'
import transformDate from './modules/utils/transform-date'
import analyzePerson from './modules/utils/analyze-person'
// import member productions
import loginMember from './modules/member/login-member'
import appPost from './modules/admin/add-post'
import newPassword from './modules/member/new-password'
import uploadDispose from './modules/admin/upload-dispose'
import newWorkflow from './modules/member/new-workflow'
import finishWorkflow from './modules/member/finish-workflow'
import startWorkflow from './modules/member/start-workflow'
import quitWorkflow from './modules/member/quit-workflow'
import getWorkflow from './modules/member/get-workflow'
import pauseWorkflow from './modules/member/pause-workflow'
import getMyDeduction from './modules/member/get-my-deduction'
import turnDown from './modules/member/turn-down'
import getMyPost from './modules/member/get-my-document'
import downloadPost from './modules/admin/download-post'
import networks from './modules/database/networks'
import allowPowers from './modules/database/allow-powers'
import getPublicPower from './modules/database/get-public-power'
import getRawMember from './modules/member/get-raw-member'

// Generate Chart Base File
const chartBase = `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8" /><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="shortcut icon" href="https://v-charts.js.org/favicon.ico" type="image/x-icon" /><title>Chart (type: <%=tit=>)</title><script src="https://cdn.jsdelivr.net/npm/vue/dist/vue.min.js"></script><script src="https://cdn.jsdelivr.net/npm/echarts@4/dist/echarts.min.js"></script><script src="https://cdn.jsdelivr.net/npm/v-charts/lib/index.min.js"></script><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/v-charts/lib/style.min.css" /></head><body><div id="app"><ve-<%=tpe=> :data="cdata"></ve-<%=tpe=>></div><script>var vm=new Vue({el:'#app',data(){const data=JSON.parse('<%=dat=>');return {cdata:data}}})</script></body></html>`
const nodataBase = `<!DOCTYPE html><html><head><meta charset="utf-8" /><title>没有数据</title><meta http-equiv="X-UA-Compatible" content="IE=edge" /><meta name="viewport" content="width=device-width, initial-scale=1.0" /><link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-plus/dist/index.css" /></head><body><div id="app"><el-empty description="没有数据"></el-empty></div><script src="https://cdn.jsdelivr.net/npm/vue@3/dist/vue.global.prod.js"></script><script src="https://cdn.jsdelivr.net/npm/element-plus"></script><script type="text/javascript">let app=Vue.createApp({setup(){return {}}});app.use(ElementPlus);app.mount("#app");</script></body></html>`
let tray: Tray
let csvTokens = {}
let docTokens = {}

// Installize Server.
const server = new Koa()
const router = new KoaRouter()
const httpServer = createServer(server.callback())
const io = new Server(httpServer, {
  cors: {
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST'],
    allowedHeaders: ['magnifique'],
    credentials: true,
  },
})
const uploader = koaMulter({
  storage: diskStorage({
    destination: resolve(tmpdir(), '../magnifique/posts'),
    filename: (_ctx, file, cb) => {
      cb(null, file.originalname)
    },
  }),
  fileFilter: (_ctx, file, cb) => {
    const filename = file.originalname.split('.').reverse()
    if (filename[0] == 'docx') {
      cb(null, true)
    } else {
      cb(null, false)
    }
  },
  limits: {
    fileSize: 30 * 1024 * 1024, // 30MB for limit.
    files: 1,
  },
})
server.use(koaBodyparser())

// Generate a get-password way for `get-method`
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const getPassword = (ctx: any) => {
  // I really don't want to let them in (Look, UP!)
  const params = new URLSearchParams(ctx.querystring)
  const password = params.get('password')
  if (password == null) {
    throw 'No this item!'
  } else {
    return password
  }
}

// Create Database(if not exists)
dbCreate()
writeData(networks())

// Serve Static File(Front End)
if (process.env.NODE_ENV == 'production') {
  server.use(koaStatic(resolve(__dirname, './pages')))
  router.get('/docs/:filename', async (ctx) => {
    ctx.response.body = readFileSync(resolve(__dirname, './docs/', ctx.params.filename)).toString()
  })
} else {
  // For safety, we don't allow to use `koaCors` in production.
  server.use(koaCors({}))
}

// Class APIs
router.get('/api/class/:gradeid/:classid/login', async (ctx) => {
  const params = new URLSearchParams(ctx.querystring)
  const password = params.get('password')
  const { gradeid, classid } = ctx.params
  ctx.response.type = 'json'
  ctx.response.body = loginClass(parseInt(gradeid), parseInt(classid), String(password))
})
router.get('/api/class/:gradeid/:classid/member/pre/get', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { gradeid, classid } = ctx.params
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      const members = getMembersPre(parseInt(gradeid), parseInt(classid)).details
      let base = []
      for (let i = 0; i in members; i++) {
        base.push(memberInformationProcess(members[i]))
      }
      ctx.response.body = {
        status: 'ok',
        details: base,
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/class/:gradeid/:classid/member/get', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { gradeid, classid } = ctx.params
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      const members = getMembers(parseInt(gradeid), parseInt(classid)).details
      let base = []
      for (let i = 0; i in members; i++) {
        base.push(memberInformationProcess(members[i]))
      }
      ctx.response.body = {
        status: 'ok',
        details: base,
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/class/:gradeid/:classid/get/:contentType', async (ctx) => {
  const params = new URLSearchParams(ctx.querystring)
  const password = params.get('password')
  const { gradeid, classid, contentType } = ctx.params
  if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
    ctx.response.body = {
      status: 'ok',
      details: objectToArray('id', parse(getContentClass(contentType, parseInt(gradeid), parseInt(classid))).details),
    }
  } else {
    ctx.response.body = {
      status: 'error',
      reason: 'password-error',
    }
  }
})
router.post('/api/class/new/feedback', async (ctx) => {
  try {
    const password = decodeBase64(ctx.request.body.password)
    const { gradeid, classid } = ctx.request.body
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      ctx.response.body = fbNew(ctx.request.body)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/class/graph/:gradeid/:classid/:start/:end/:type/person', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { gradeid, classid, start, end, type } = ctx.params
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      const chartData = chartClassPerson(parseInt(gradeid), parseInt(classid), start, end)
      ctx.response.type = 'plain'
      ctx.response.body = chartBase.split('<%=tit=>').join(type).split('<%=tpe=>').join(type).split('<%=dat=>').join(JSON.stringify(chartData))
      if (chartData.rows.length == 0) {
        ctx.response.body = nodataBase
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/class/graph/:gradeid/:classid/:start/:end/:type/reason', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { gradeid, classid, start, end, type } = ctx.params
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      const chartData = chartClassReason(parseInt(gradeid), parseInt(classid), start, end)
      ctx.response.type = 'html'
      ctx.response.body = chartBase.split('<%=tit=>').join(type).split('<%=tpe=>').join(type).split('<%=dat=>').join(JSON.stringify(chartData))
      if (chartData.rows.length == 0) {
        ctx.response.body = nodataBase
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/class/graph/:gradeid/:classid/:start/:end/:type/date', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { gradeid, classid, start, end, type } = ctx.params
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      const chartData = chartClassDate(parseInt(gradeid), parseInt(classid), start, end)
      ctx.response.type = 'plain'
      ctx.response.body = chartBase.split('<%=tit=>').join(type).split('<%=tpe=>').join(type).split('<%=dat=>').join(JSON.stringify(chartData))
      if (chartData.rows.length == 0) {
        ctx.response.body = nodataBase
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/class/member/regist', async (ctx) => {
  try {
    const { gradeid, classid, password, member } = ctx.request.body
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      ctx.response.body = addMemberPre(member)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/class/edit/password', async (ctx) => {
  try {
    const password = ctx.request.body.password
    const { gradeid, classid, newp } = ctx.request.body
    if (loginClass(parseInt(gradeid), parseInt(classid), String(password)).status == 'ok') {
      ctx.response.body = editPassword(gradeid, classid, decodeBase64(newp))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})

// Member APIs
router.get('/api/member/getinfo/:person', async (ctx) => {
  try {
    const { person } = ctx.params
    ctx.response.body = getMemberInf(parseInt(person))
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/member/getinfo/:id/raw', async (ctx) => {
  try {
    const { id } = ctx.params
    ctx.response.body = getRawMember(parseInt(id))
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/member/:id/login', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { id } = ctx.params
    ctx.response.body = loginMember(parseInt(id), password)
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/admin/trans/member', async (ctx) => {
  try {
    const { password, member, number, position } = ctx.request.body
    if (loginMember(parseInt(number), password).status == 'ok') {
      ctx.response.body = moveToRelMember(parseInt(member), position)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/admin/del/member', async (ctx) => {
  try {
    const { password, person, number } = ctx.request.body
    if (loginMember(parseInt(number), password).status == 'ok') {
      ctx.response.body = delMember(parseInt(person))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/admin/new/member', async (ctx) => {
  try {
    const { password, number, member } = ctx.request.body
    if (loginMember(parseInt(number), password).status == 'ok') {
      ctx.response.body = addMember(member)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/member/admin/:number/get/:department/member', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginMember(parseInt(ctx.params.number), password).status == 'ok') {
      ctx.response.body = processAllMemberInfo(getDepartmentMember(ctx.params.department))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/edit/password', async (ctx) => {
  try {
    const { password } = ctx.request.body
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      ctx.response.body = newPassword(parseInt(id), decodeBase64(ctx.request.body.newp))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/member/:id/workflow/get', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      ctx.response.body = getWorkflow(parseInt(id))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/workflow/new', async (ctx) => {
  try {
    const { password } = ctx.request.body
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      let detail = ctx.request.body
      delete detail['password']
      ctx.response.body = newWorkflow(parseInt(id), detail)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/workflow/pause', async (ctx) => {
  try {
    const { password, id } = ctx.request.body
    const { id: num } = ctx.params
    if (loginMember(parseInt(num), password).status == 'ok') {
      ctx.response.body = pauseWorkflow(parseInt(num), id)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/workflow/finish', async (ctx) => {
  try {
    const { password, id } = ctx.request.body
    const { id: num } = ctx.params
    if (loginMember(parseInt(num), password).status == 'ok') {
      ctx.response.body = finishWorkflow(parseInt(num), id)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/workflow/start', async (ctx) => {
  try {
    const { password, id } = ctx.request.body
    const { id: num } = ctx.params
    if (loginMember(parseInt(num), password).status == 'ok') {
      ctx.response.body = startWorkflow(parseInt(num), id)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/:id/workflow/quit', async (ctx) => {
  try {
    const { password, id } = ctx.request.body
    const { id: num } = ctx.params
    if (loginMember(parseInt(num), password).status == 'ok') {
      ctx.response.body = quitWorkflow(parseInt(num), id)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})

// 纪检部可用API
router.get('/api/member/admin/:id/get/all/deduction', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginMember(parseInt(ctx.params.id), password).status == 'ok') {
      if ((getRawMember(parseInt(ctx.params.id)).details as member).union.admin.includes('deduction')) {
        ctx.response.body = getAllDeductions()
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/admin/:id/del/deduction', async (ctx) => {
  try {
    const { password } = ctx.request.body
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      ctx.response.body = delDeduction(parseInt(ctx.request.body.person), ctx.request.body.id)
      io.emit(
        'del-deduc',
        JSON.stringify({
          person: ctx.request.body.person,
          id: ctx.request.body.id,
        })
      )
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/member/deduction/:id/work/get/deduction', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      if (getRawMember(parseInt(id)).details.union.duty.includes('deduction')) {
        ctx.response.body = getMyDeduction(parseInt(id))
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/deduction/:id/work/new/deduction', async (ctx) => {
  try {
    const { id } = ctx.params
    const { password, content } = ctx.request.body
    if (loginMember(parseInt(id), password).status == 'ok') {
      if ((getRawMember(parseInt(id)).details as member).union.duty.includes('deduction')) {
        ctx.response.body = addDeduction(content)
        io.emit('new-deduc', JSON.stringify(content))
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/deduction/:id/work/turnd/deduction', async (ctx) => {
  try {
    const { id: number } = ctx.params
    const { id, password, person, reason } = ctx.request.body
    if (loginMember(parseInt(number), password).status == 'ok') {
      if ((getRawMember(parseInt(number)).details as member).union.duty.includes('deduction')) {
        ctx.response.body = turnDown(person, id, reason)
        io.emit('turnd-deduc', JSON.stringify({ person, id, reason }))
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/deduction/:id/work/del/deduction', async (ctx) => {
  try {
    const { id: number } = ctx.params
    const { id, password, person } = ctx.request.body
    if (loginMember(parseInt(number), password).status == 'ok') {
      if ((getRawMember(parseInt(number)).details as member).union.duty.includes('deduction')) {
        ctx.response.body = delDeduction(person, id)
        io.emit('del-deduc', JSON.stringify({ person, id }))
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})

// 学习部可用API
router.get('/api/member/post/:id/work/get/post', async (ctx) => {
  try {
    const password = getPassword(ctx)
    const { id } = ctx.params
    if (loginMember(parseInt(id), password).status == 'ok') {
      if ((getRawMember(parseInt(id)).details as member).union.duty.includes('post')) {
        ctx.response.body = getMyPost(parseInt(id))
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/post/:id/work/upload/post', uploader.single('file'), async (ctx) => {
  if (ctx.file !== undefined) {
    ctx.response.body = uploadDispose(parseInt(ctx.params.id), ctx.file)
  } else {
    ctx.response.body = {
      status: 'error',
      reason: 'incorrect-type',
    }
  }
})
router.get('/api/member/download/:id', async (ctx) => {
  ctx.response.type = 'docx'
  ctx.response.body = docTokens[ctx.params.id]
  delete docTokens[ctx.params.id]
})
router.post('/api/member/post/:id/work/download/post', async (ctx) => {
  try {
    const { id, password, person } = ctx.request.body
    if (loginMember(parseInt(person), password).status == 'ok') {
      if ((getRawMember(parseInt(id)).details as member).union.duty.includes('post')) {
        let index = v4()
        while (docTokens[index] !== undefined) {
          index = v4()
        }
        docTokens[index] = downloadPost(id, person)
        ctx.response.body = {
          status: 'ok',
          details: {
            token: index,
          },
        }
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/member/post/:id/work/new/post', async (ctx) => {
  try {
    const { id, password, content, person } = ctx.request.body
    if (loginMember(parseInt(person), password).status == 'ok') {
      if ((getRawMember(parseInt(id)).details as member).union.duty.includes('post')) {
        ctx.response.body = appPost(parseInt(person), id, content)
      } else {
        ctx.response.body = {
          status: 'error',
          reason: 'no-auth',
        }
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})

// Admin APIs (For School Leaders.)
router.get('/api/admin/login', async (ctx) => {
  try {
    const password = getPassword(ctx)
    ctx.response.body = loginAdmin(password)
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/admin/get/all/deduction', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = getAllDeductions()
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/admin/get/all/member', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = processAllMemberInfo(getAllMembers())
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/admin/get/core/member', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = processAllMemberInfo(getCoreMember())
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/admin/export/download/:token', async (ctx) => {
  ctx.response.type = 'text/csv'
  ctx.response.body = encodeGBK(csvTokens[ctx.params.token], 'gbk')
  delete csvTokens[ctx.params.token]
})

router.post('/api/admin/edit/password', async (ctx) => {
  try {
    const password = ctx.request.body.password
    const { newp } = ctx.request.body
    if (loginAdmin(String(password)).status == 'ok') {
      ctx.response.body = resetPassword(decodeBase64(newp))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/export/deduction/class', async (ctx) => {
  try {
    const { password, start, end } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      const data = getClassTotal({
        start,
        end,
      })
      const token = generateToken()
      csvTokens[token] = data.details
      ctx.response.body = {
        status: 'ok',
        details: {
          token,
        },
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/export/deduction/detail', async (ctx) => {
  try {
    const { password, start, end } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      const data = deductionExportReason({
        start,
        end,
      })
      const token = generateToken()
      csvTokens[token] = data.details
      ctx.response.body = {
        status: 'ok',
        details: {
          token,
        },
      }
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/admin/get/:department/member', async (ctx) => {
  try {
    const password = getPassword(ctx)
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = processAllMemberInfo(getDepartmentMember(ctx.params.department))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/del/deduction', async (ctx) => {
  try {
    const { password } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = delDeduction(parseInt(ctx.request.body.person), ctx.request.body.id)
      io.emit(
        'del-deduc',
        JSON.stringify({
          person: ctx.request.body.person,
          id: ctx.request.body.id,
        })
      )
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/full/member', async (ctx) => {
  try {
    const { password, member, position } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = moveToRelMember(parseInt(member), position as 'clerk' | 'vice-minister')
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/new/member', async (ctx) => {
  try {
    const { password, member } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = addMember(member)
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.post('/api/admin/del/member', async (ctx) => {
  try {
    const { password, person } = ctx.request.body
    if (loginAdmin(password).status == 'ok') {
      ctx.response.body = delMember(parseInt(person))
    } else {
      ctx.response.body = {
        status: 'error',
        reason: 'password-wrong',
      }
    }
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
// All APIs
router.post('/api/feed/back', async (ctx) => {
  // Here, it is no use to check the password
  try {
    ctx.response.body = fbNewE(ctx.request.body)
  } catch (e) {
    ctx.response.body = {
      status: 'error',
      reason: 'type-error',
      text: new Error(<string>e).message,
    }
  }
})
router.get('/api/department/', async (ctx) => {
  ctx.response.body = getDepartmentData() as status
})
router.get('/api/department/list', async (ctx) => {
  const data = getDepartmentData()
  ctx.response.body = {
    status: 'ok',
    details: objectToArray('value', data.details.departments),
  }
})
router.get('/api/department/:department/duty', async (ctx) => {
  ctx.response.body = {
    status: 'ok',
    details: allowPowers(ctx.params.department),
  }
})
router.get('/api/power/list', async (ctx) => {
  ctx.response.body = {
    status: 'ok',
    details: objectToArray('value', getPublicPower().details.power),
  }
})
router.get('/api/power', async (ctx) => {
  ctx.response.body = getPublicPower()
})
router.get('/api/transformDate/:year', async (ctx) => {
  ctx.response.body = {
    status: 'ok',
    details: transformDate(parseInt(ctx.params.year)),
  }
})
router.get('/api/analyzePerson/:person', async (ctx) => {
  ctx.response.body = {
    status: 'ok',
    details: analyzePerson(parseInt(ctx.params.person)),
  }
})
router.get('/config', async (ctx) => {
  ctx.response.body = readData()
})

// Use routes to register APIs.
server.use(router.routes())
server.use(router.allowedMethods())

// Redirect 404 pages(route)
server.use(async (ctx) => {
  if (ctx.status == 404) {
    if (process.env.NODE_ENV == 'production') {
      ctx.response.body = readFileSync(resolve(__dirname, './pages/index.html')).toString()
    } else {
      ctx.response.type = 'html'
      ctx.response.body = 'Sorry, we do not have index page in <b>Develoption</b> server.'
    }
  }
})

// Socket.io Chat Product
// eslint-disable-next-line @typescript-eslint/no-unused-vars
io.on('connection', (socket) => {
  // ...
  let query
  if (socket.handshake.query.type == 'class') {
    query = `class/${transformDate(<number>(<unknown>socket.handshake.query.gradeid))} / ${<number>(<unknown>socket.handshake.query.classid)}`
  } else {
    query = 'admin'
  }
  socket.to(query).emit('quit-app')
  socket.join(query)
  socket.emit('connect-successfully')
})

app.setLoginItemSettings({
  openAtLogin: process.env.NODE_ENV == 'production',
})

app.whenReady().then(() => {
  tray = new Tray(process.env.NODE_ENV === 'development' ? resolve(__dirname, '../icons/server.ico') : resolve(__dirname, '../icons/server.ico'))
  const generateTwoThirds = (val: number) => Math.floor((val * 2) / 3)
  const { width, height } = screen.getPrimaryDisplay().workAreaSize
  const mainWindow = new BrowserWindow({
    width: generateTwoThirds(width),
    height: generateTwoThirds(height),
    frame: false,
    webPreferences: {
      preload: resolve(__dirname, process.env.NODE_ENV == 'development' ? './preload.js' : './preload.min.js'),
    },
    show: false,
  })
  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
  })
  process.env.NODE_ENV == 'development' && mainWindow.webContents.openDevTools()
  tray.setContextMenu(
    Menu.buildFromTemplate([
      {
        label: '打开主界面',
        click: () => mainWindow.show(),
      },
      {
        type: 'separator',
      },
      {
        label: '退出',
        click: () => {
          mainWindow.destroy()
          app.quit()
        },
      },
    ])
  )
  tray.on('double-click', () => mainWindow.show())
  mainWindow.loadURL(process.env.NODE_ENV == 'development' ? 'http://localhost:3000/server' : 'http://localhost/server')
  ipcMain.on('close-main-window', () => mainWindow.hide())
  ipcMain.on('minimize-main-window', () => mainWindow.minimize())
  ipcMain.on('maximize-main-window', () => (mainWindow.isMaximized() ? mainWindow.unmaximize() : mainWindow.maximize()))
  mainWindow.on('close', (event) => {
    mainWindow.hide()
    event.preventDefault()
  })
})

// Listen the Server(Let it run.)
httpServer.listen(80)

try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  require('electron-reloader')(module)
  // eslint-disable-next-line no-empty
} catch (_e) {}
