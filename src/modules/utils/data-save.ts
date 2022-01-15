import { PathLike, writeFileSync } from 'fs'
import encodeBase64 from './encode-base64'
import { stringify } from 'json5'

export default (path: PathLike, content: object) => {
    writeFileSync(path, encodeBase64(stringify(content)))
}
