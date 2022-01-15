import { tmpdir } from 'os'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { resolve } from 'path'
import { sha512 } from 'js-sha512'
import * as JSON5 from 'json5'
import transformDate from '../utils/transform-date'

const generateRoot = () => {
  const tpth = resolve(tmpdir(), '../magnifique/')
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateAdminPassword = (basep: string) => {
  if (!existsSync(resolve(basep, './password.sdbdata'))) {
    writeFileSync(
      resolve(basep, './password.sdbdata'),
      Buffer.from(
        JSON5.stringify({
          secret: {
            password: sha512('secret'),
          },
        })
      ).toString('base64')
    )
  }
}

const generateAdminFolder = (basep: string) => {
  const tpth = resolve(basep, './admin/')
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateFeedbackFolder = (basep: string) => {
  const tpth = resolve(basep, './feedback/')
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateGradeFolder = (basep: string, gradeid: number) => {
  const tpth = resolve(basep, String(transformDate(gradeid)))
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateClassFolder = (basep: string, classid: number) => {
  const tpth = resolve(basep, String(classid))
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateClassMemberFolder = (basep: string) => {
  const tpth = resolve(basep, './members')
  if (!existsSync(tpth)) {
    mkdirSync(tpth)
  }
  return tpth
}

const generateClassDetail = (basep: string, file: string) => {
  if (!existsSync(resolve(basep, `./${file}.sdbdata`))) {
    writeFileSync(
      resolve(basep, `./${file}.sdbdata`),
      Buffer.from(
        JSON5.stringify({
          details: {},
        })
      ).toString('base64')
    )
  }
}

const generateClassPassword = (basep: string, gradeid: number, classid: number) => {
  if (!existsSync(resolve(basep, './password.sdbdata'))) {
    writeFileSync(
      resolve(basep, './password.sdbdata'),
      Buffer.from(
        JSON5.stringify({
          password: sha512(String(transformDate(gradeid) * 100 + classid)),
        })
      ).toString('base64')
    )
  }
}

export default () => {
  const rt = generateRoot()
  for (let i = 1; i <= 3; i++) {
    const basep = generateGradeFolder(rt, i)
    for (let j = 1; j <= 15; j++) {
      const bsec = generateClassFolder(basep, j)
      generateClassPassword(bsec, i, j)
      generateClassMemberFolder(bsec)
      generateClassDetail(bsec, 'deduction')
      generateClassDetail(bsec, 'document')
      generateClassDetail(bsec, 'activity')
      generateClassDetail(bsec, 'orgnize')
      generateClassDetail(bsec, 'radio')
      generateClassDetail(bsec, 'volunteer')
    }
  }
  generateAdminPassword(generateAdminFolder(rt))
  generateFeedbackFolder(rt)
}
