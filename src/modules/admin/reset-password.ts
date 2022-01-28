import { tmpdir } from 'os'
import { writeFileSync, existsSync } from 'fs'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import { stringify } from 'json5'

export default (newPwd: string) => {
  const temppath = resolve(tmpdir(), `../magnifique/admin/password.sdbdata`)
  if (existsSync(temppath)) {
    try {
      writeFileSync(
        resolve(temppath, './admin/password.sdbdata'),
        Buffer.from(
          stringify({
            secret: {
              password: sha512(newPwd),
            },
          })
        ).toString('base64')
      )
    } catch (e) {
      return {
        status: 'error',
        reason: 'type-error',
        text: <string>e,
      } as status
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    } as status
  }
}
