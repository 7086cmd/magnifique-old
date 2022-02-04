/* eslint-disable no-console */
import { build as buildFrontEnd } from 'vite'
import { build as buildBackEnd } from 'esbuild'
import { build as buildApp } from 'electron-builder'
import { resolve } from 'path'
import { mkdir } from 'fs/promises'
import lintFile from './lint.mjs'
const main = async () => {
  await lintFile()
  await buildFrontEnd()
  await buildBackEnd({
    entryPoints: ['src/main.ts'],
    outfile: 'dist/server.min.js',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
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
    outfile: 'dist/server.preload.min.js',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
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
    outfile: 'dist/client.min.js',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
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
    outfile: 'dist/client.preload.min.js',
    bundle: true,
    platform: 'node',
    format: 'cjs',
    minify: true,
    sourcemap: true,
    target: ['node16'],
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
  await buildApp({
    publish: 'never',
    config: {
      files: ['./dist/client.min.js', './dist/client.preload.min.js', './icons/client.ico'],
      extraMetadata: {
        main: 'dist/client.min.js',
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
  await buildApp({
    publish: 'always',
    config: {
      files: ['./dist/docs/**/*', './dist/pages/**/*', './dist/docs/*', './dist/pages/*', './dist/server.min.js', './dist/server.preload.min.js', './icons/server.ico'],
      extraMetadata: {
        main: 'dist/server.min.js',
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
}
main()
