import { existsSync, statSync, readdirSync, readFileSync, writeFileSync } from 'fs'
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
      // atotal.includes('color="#626aef"') && console.log(itemPath)
      writeFileSync(itemPath, atotal.replaceAll('color="#626aef"', 'color="#626aef" style="color: white"'))
    } else if (lstType.isDirectory()) {
      copyDir(itemPath, resolve(src, item))
    }
  })
}

copyDir(resolve('src'))
