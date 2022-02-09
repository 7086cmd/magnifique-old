import { existsSync } from 'fs'
import { getSingleMemberAsRaw, createNewAction } from '../../../member'
import { createSdbdataParser, createSdbdataSaver, createMemberIndex } from '../../../../utils'

export default (person: number, id: string) => {
  const temppath = createMemberIndex(person)
  if (existsSync(temppath)) {
    try {
      const decoded = createSdbdataParser(temppath) as {
        details: Record<string, deduction>
      }
      if (existsSync(createMemberIndex(person))) {
        const persondetail = getSingleMemberAsRaw(person).details as member
        delete persondetail.deduction.details[id]
        createSdbdataSaver(createMemberIndex(persondetail.number), persondetail)
      }
      createNewAction((decoded.details[id] as deduction).deductor.number, -1)
      delete decoded.details[id]
      createSdbdataSaver(temppath, decoded)
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
