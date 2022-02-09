import { existsSync, statSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'

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
      if (atotal.includes("'src/")) console.log(itemPath)
    } else if (lstType.isDirectory()) {
      copyDir(itemPath, resolve(src, item))
    }
  })
}

copyDir(resolve('src'))
