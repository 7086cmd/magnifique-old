import { PathLike, readFileSync } from 'fs'
import decodeBase64 from './decode-base64'
import { parse } from 'json5'

export default (path: PathLike) => {
    return parse(decodeBase64(readFileSync(path).toString()))
}
