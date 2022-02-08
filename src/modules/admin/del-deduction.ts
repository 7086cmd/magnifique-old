import { tmpdir } from 'os'
import { writeFileSync, existsSync, readFileSync } from 'fs'
import { resolve } from 'path'
import { parse, stringify } from 'json5'
import decoder from '../utils/decode-base64'
import encoder from '../utils/encode-base64'
import analyzePerson from '../utils/analyze-person'
import addAction from '../member/records/actions/add-action'
import generateMemberIndex from '../utils/generate-member-index'
import getRawMember from '../member/get-raw-member'
import dataSave from '../utils/data-save'

export default (person: number, id: string) => {
  const { gradeid, classid } = analyzePerson(person)
  const temppath = resolve(tmpdir(), `../magnifique/${gradeid}/${classid}/deduction.sdbdata`)
  if (existsSync(temppath)) {
    try {
      const doc = readFileSync(temppath).toString()
      const decoded = parse(decoder(doc))
      if (existsSync(generateMemberIndex(person))) {
        const persondetail = getRawMember(person).details as member
        delete persondetail.deduction.details[id]
        dataSave(generateMemberIndex(persondetail.number), persondetail)
      }
      addAction((decoded.details[id] as deduction).deductor.number, -1)
      delete decoded.details[id]
      const docc = stringify(decoded)
      writeFileSync(temppath, encoder(docc))
      return {
        status: 'ok',
      } as status
    } catch (e) {
      return {
        status: 'error',
        reason: 'type-error',
        text: new Error(<string>e).message,
      } as status
    }
  } else {
    return {
      status: 'error',
      reason: 'not-exists',
    } as status
  }
}
