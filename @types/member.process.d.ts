declare interface member_processed {
  name: string
  number: number
  in: string[]
  do: string[]
  icg: boolean
  record: {
    actions: number
    score: number
    violation: number
  }
  duty: string[]
  admin: string[]
}
