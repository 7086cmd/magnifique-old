/* eslint-disable no-console */
import { build as buildFrontEnd } from 'vite'
import { build as buildBackEnd } from 'esbuild'
import { build as buildApp } from 'electron-builder'
import { ESLint } from 'eslint'
import chalk from 'chalk'
import { platform } from 'os'
import { exec } from 'child_process'
import { resolve } from 'path'
import { mkdir, rename, readFile } from 'fs/promises'

const lintFile = async () => {
  const eslint = new ESLint()
  const results = await eslint.lintFiles(['src/**/*.ts', 'src/main.ts', 'src/**/*.vue'])
  let tw = 0,
    te = 0
  let hasw = false
  for (let i = 0; i in results; i++) {
    if (results[i].messages.length != 0) {
      console.log(chalk.underline(results[i].filePath))
      hasw = true
    }
    for (let j = 0; j in results[i].messages; j++) {
      if (results[i].messages[j].severity == 1) {
        console.log(
          '  ' +
            chalk.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) +
            '  ' +
            chalk.yellow('warning') +
            '  ' +
            results[i].messages[j].message +
            '  ' +
            chalk.dim(results[i].messages[j].ruleId)
        )
      } else if (results[i].messages[j].severity == 2) {
        console.log(
          '  ' +
            chalk.dim(`${results[i].messages[j].line}:${results[i].messages[j].column}`) +
            '  ' +
            chalk.red('error') +
            '  ' +
            results[i].messages[j].message +
            '  ' +
            chalk.dim(results[i].messages[j].ruleId)
        )
      }
    }
    if (results[i].messages.length != 0) {
      console.log()
    }
    tw += results[i].warningCount
    te += results[i].errorCount
  }
  if (hasw) {
    console.log(chalk.bold.yellow(`✖ ${tw + te} problems (${te} errors, ${tw} warnings)`))
  }
  if (te > 0) {
    console.log(chalk.dim.red('Builder is waiting for no error.'))
  }
}
;(async () => {
  if (platform() == 'darwin') {
    await exec('pnpm install dmg-license -D')
  } else {
    console.log(platform(), 'Skipped to install dmg-license.')
  }
  await lintFile()
  await buildFrontEnd()
  await buildBackEnd({
    entryPoints: ['src/main.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd */',
    },
    treeShaking: true,
    external: ['electron'],
    metafile: true,
  })
  await buildBackEnd({
    entryPoints: ['src/preload.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await buildBackEnd({
    entryPoints: ['src/client/main.js'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.client.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await buildBackEnd({
    entryPoints: ['src/client/preload.ts'],
    outdir: 'dist',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
    outExtension: {
      '.js': '.client.min.js',
    },
    loader: {
      '.png': 'file',
      '.ts': 'ts',
    },
    logLevel: 'info',
    chunkNames: 'chunks/[name]-[hash]',
    assetNames: 'assets/[name]-[hash]',
    color: true,
    define: {
      'process.env.NODE_ENV': "'production'",
    },
    banner: {
      js: '/* Copyright© 2022 7086cmd */',
    },
    treeShaking: true,
    external: ['electron'],
  })
  await mkdir(resolve('dist', 'pages', 'app'))
  const token = process.env.GITHUB_TOKEN
  process.env.GITHUB_TOKEN = undefined
  await buildApp({
    config: {
      files: ['./dist/main.client.min.js', './dist/preload.client.min.js', './icons/client.ico'],
      extraMetadata: {
        main: 'dist/main.client.min.js',
      },
      directories: {
        output: 'dist/pages/app',
      },
      asar: true,
      extends: null,
      appId: 'com.magnifique.client',
      copyright: 'Copyright ©7086cmd 2021 GNU License',
      productName: 'Magnifique Client',
      win: {
        icon: './icons/client.ico',
        target: [
          {
            target: 'nsis',
            arch: ['x64'],
          },
        ],
        publish: undefined,
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        shortcutName: 'Magnifique Client',
        menuCategory: 'Magnifique',
      },
    },
  })
  const { version } = JSON.parse((await readFile(resolve('package.json'))).toString())
  await rename(resolve('dist', 'pages', 'app', `Magnifique Client Setup ${version}.exe`), resolve('dist', 'pages', 'app', 'app.exe'))
  await rename(resolve('dist', 'pages', 'app', `Magnifique Client Setup ${version}.exe.blockmap`), resolve('dist', 'pages', 'app', 'app.exe.blockmap'))
  await buildApp({
    config: {
      files: ['./dist/docs/**/*', './dist/pages/**/*', './dist/docs/*', './dist/pages/*', './dist/main.min.js', './dist/preload.min.js', './icons/server.ico'],
      extraMetadata: {
        main: 'dist/main.min.js',
      },
      asar: true,
      extends: null,
      appId: 'com.magnifique.server',
      copyright: 'Copyright ©7086cmd 2021 GNU License',
      productName: 'Magnifique Server',
      win: {
        icon: './icons/server.ico',
        target: [
          {
            target: 'nsis',
            arch: ['x64'],
          },
        ],
        publish: [
          {
            provider: 'github',
            owner: '7086cmd',
            repo: 'magnifique',
            token: token,
          },
        ],
      },
      nsis: {
        oneClick: false,
        perMachine: false,
        allowToChangeInstallationDirectory: true,
        shortcutName: 'Magnifique Server',
        menuCategory: 'Magnifique',
      },
    },
  })
})()
