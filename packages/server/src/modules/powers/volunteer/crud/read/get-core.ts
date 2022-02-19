import { getCoreAsRaw } from '../../../member'
import getOwn from './get-own'
import { createObjectToArrayTransformer } from '../../../../utils'
interface VolunteerWorking {
  person: number | number[]
  duration: number
  project: string
  place: string
  status: 'planning' | 'done' | 'miss'
  time: string
  createId: string
  idInUserData: string
}

type middle = Record<string, VolunteerQueryResult>

export default () => {
  const memberList = getCoreAsRaw().details as member[]
  let volList: middle = {}
  memberList.forEach((item) => {
    getOwn(item.number).details.forEach((volData) => {
      if (volList[volData.createId] === undefined) {
        let data: VolunteerWorking = volData
        data.person = [data.person as number]
        volList[volData.createId] = data as VolunteerQueryResult
      } else {
        volList[volData.createId].person.push(volData.person)
      }
    })
  })
  return {
    status: 'ok',
    details: createObjectToArrayTransformer('createId', volList) as VolunteerQueryResult[],
  }
}
