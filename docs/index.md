# Stunning App

## Wiki

使用：

-   koa
-   socket.io
-   electron
-   vite
-   vue
    等新颖的`library`而成

## Install

> 该项目使用`pnpm`进行包管理，而且开启了`only-allow`

### 安装

```bash
pnpm install
```

### 开发

```bash
pnpm run serve
# or
pnpm run dev
```

开发使用：

1. `Vite.js`进行前端热更新
2. `VitePress`文档
3. `esbuild`编译`TypeScript`

### 预构建

::: tip 预构建含义
预构建指只构建文档、后端脚本、前端页面，不将其构建为应用
:::

```bash
pnpm run prebuild
```

### 构建

```bash
pnpm run build
```

## 源码结构

所有的源码全部放置在`/src`文件夹里面
