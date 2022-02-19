import { v1 } from 'uuid'
import create from './create'

interface VolunteerMultiMiddle {
  duration: number
  project: string
  place: string
  status: 'planning' | 'done' | 'miss'
  time: string
  createId: string
}

export default (Data: VolunteerMulti) => {
  Data.createId = v1()
  let data = Object.assign({}, Data)
  delete data.person
  Data.person.forEach((item) => {
    const volunteerForPerson = {
      person: item,
      ...(data as VolunteerMultiMiddle),
    } as volunteer
    create(item, volunteerForPerson)
  })
  return {
    status: 'ok',
  }
}
