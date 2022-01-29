import { existsSync, statSync, readdirSync, readFileSync } from 'fs'
import { resolve } from 'path'
import JSON5 from 'json5'

const totalSizes = {}

const copyDir = (src) => {
  if (!existsSync(src)) {
    return
  }
  const dir = readdirSync(src)
  dir.forEach((item) => {
    const itemPath = resolve(src, item)
    const lstType = statSync(itemPath)
    if (lstType.isFile()) {
      if (readFileSync(itemPath).toString().includes('document')) {
        console.log(itemPath)
      }
    } else if (lstType.isDirectory()) {
      copyDir(itemPath, resolve(src, item))
    }
  })
}

copyDir(resolve('src'))
copyDir(resolve('test'))
copyDir(resolve('scripts'))

process.stdout.write(JSON5.stringify(totalSizes, null, 4))
