declare interface volunteer {
  person: {
    name: string
    number: number
  }[]
  duration: number
  index: string[]
  status: 'planning' | 'done' | 'miss'
}
