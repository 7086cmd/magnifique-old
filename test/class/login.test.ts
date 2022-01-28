import transformDate from '../../src/modules/utils/transform-date'
import loginClass from '../../src/modules/class/login-class'
import dbCreate from '../../src/modules/database/db-create'
import { expect, test, describe } from '@jest/globals'

dbCreate()

describe('Login tests', () => {
  for (let i = 1; i <= 10; i++) {
    let classid = Math.floor(Math.random() * 15)
    while (classid == 0) {
      classid = Math.floor(Math.random() * 15)
    }
    test('Login for Junior 1, ' + String(classid), () => {
      const paswdnum = transformDate(1) * 100 + classid
      const result = loginClass(1, classid, Buffer.from(String(paswdnum)).toString('base64'))
      expect(result.status).toBe('ok')
    })
    test('Login for Junior 2, ' + String(classid), () => {
      const paswdnum = transformDate(2) * 100 + classid
      const result = loginClass(2, classid, Buffer.from(String(paswdnum)).toString('base64'))
      expect(result.status).toBe('ok')
    })
    test('Login for Junior 3, ' + String(classid), () => {
      const paswdnum = transformDate(3) * 100 + classid
      const result = loginClass(3, classid, Buffer.from(String(paswdnum)).toString('base64'))
      expect(result.status).toBe('ok')
    })
  }
})
