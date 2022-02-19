import dayjs from 'dayjs'
import { v4 } from 'uuid'

export default () =>
  ({
    person: [],
    duration: 0,
    project: '',
    place: '',
    status: 'planning',
    time: dayjs().toJSON(),
    createId: v4(),
  } as VolunteerMulti)
