import { existsSync } from 'fs'
import { createMemberIndex, createSdbdataParser, createSdbdataSaver, createTypeError, createUserDataError } from '../../../../utils'

export default (numb: number, toPosition: 'clerk' | 'vice-minister') => {
  const temppath = createMemberIndex(numb)
  if (existsSync(temppath)) {
    try {
      let oldData = createSdbdataParser(temppath) as member
      oldData.union.position = toPosition as 'clerk' | 'vice-minister'
      if (toPosition === 'vice-minister') {
        oldData.union.admin = oldData.union.duty
      } else if (toPosition === 'clerk') {
        oldData.union.admin = []
      } else {
        throw '无法转为该身份'
      }
      createSdbdataSaver(temppath, oldData)
      return {
        status: 'ok',
      }
    } catch (e) {
      return createTypeError(e)
    }
  } else {
    return createUserDataError('not-exists')
  }
}
