import { existsSync, statSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import JSON5 from 'json5'

const totalSizes = {}
let total = 0

const copyDir = (src) => {
  if (!existsSync(src)) {
    return
  }
  const dir = readdirSync(src)
  dir.forEach((item) => {
    const itemPath = resolve(src, item)
    const lstType = statSync(itemPath)
    if (lstType.isFile()) {
      total += readFileSync(itemPath)
        .toString()
        .split('\r')
        .join('\n')
        .split('\n')
        .filter((x) => x !== '').length
    } else if (lstType.isDirectory()) {
      copyDir(itemPath, resolve(src, item))
    }
  })
}

const copyDir2 = (src) => {
  if (!existsSync(src)) {
    return
  }
  const dir = readdirSync(src)
  dir.forEach((item) => {
    const itemPath = resolve(src, item)
    const lstType = statSync(itemPath)
    if (lstType.isFile()) {
      total += readFileSync(itemPath)
        .toString()
        .split('\r')
        .join('\n')
        .split('\n')
        .filter((x) => x !== '').length
    }
  })
}
// copyDir2(resolve())
copyDir(resolve('src'))
copyDir(resolve('test'))
copyDir(resolve('scripts'))

console.log(total)
