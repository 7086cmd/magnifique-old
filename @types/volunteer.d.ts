declare interface volunteer {
  person: string
  duration: number
  project: string
  place: string
  status: 'planning' | 'done' | 'miss'
  time: Date
}
