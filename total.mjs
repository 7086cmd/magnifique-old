import { existsSync, statSync, readdirSync, readFileSync, writeFileSync } from 'fs'
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
      let atotal = readFileSync(itemPath).toString()
      atotal.includes('type="primary"') && console.log(itemPath)
      writeFileSync(itemPath, atotal.replaceAll('type="primary"', 'color="#626aef"'))
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
