declare interface volunteer {
  person: number
  duration: number
  project: string
  place: string
  status: 'planning' | 'done' | 'miss'
  time: Date
}
