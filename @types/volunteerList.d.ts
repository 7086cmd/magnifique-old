declare interface VolunteerList {
  person: number
  duration: number
  project: string
  place: string
  status: 'planning' | 'done' | 'miss'
  time: Date
  createId: string
  idInUserData: string
}
