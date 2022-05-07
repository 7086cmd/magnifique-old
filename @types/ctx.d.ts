import type Koa from 'koa'
import type KoaRouter from '@koa/router'
import type { File } from '@koa/multer'

export type Context = Koa.ParameterizedContext<Koa.DefaultState, Koa.DefaultContext & KoaRouter.RouterParamContext<Koa.DefaultState, Koa.DefaultContext>> & {
  file: File
}

declare type RouterContext = Context
