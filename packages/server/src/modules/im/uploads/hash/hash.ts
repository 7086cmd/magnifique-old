import { PathLike, readFileSync } from 'fs'
import { createHash } from 'crypto'

const createFileHash = (filePath: PathLike) => {
  const hasher = createHash('sha512')
  const fileBuffer = readFileSync(filePath)
  hasher.update(fileBuffer)
  const result = hasher.digest('hex')
  return result
}

export { createFileHash }
