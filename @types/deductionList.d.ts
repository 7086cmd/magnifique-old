declare interface DeductionList {
  id: string
  person: number
  reason: string
  description?: string
  deduction: number
  deductor: {
    name: string
    number: number
  }
  time: string
  place: string
  status: 'normal' | 'processing' | 'failed'
}
