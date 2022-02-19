import dayjs from 'dayjs'

export default () =>
  ({
    title: '',
    description: '',
    person: 0,
    time: dayjs().toJSON(),
    path: '',
    type: '其他',
    id: '',
  } as PostList)
