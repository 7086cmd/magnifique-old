import { buildSync } from 'esbuild'

buildSync({
  entryPoints: ['src/preload.ts'],
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
