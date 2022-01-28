declare interface member {
  name: string
  number: number
  youth: 'none' | 'training' | 'pre' | 'formal'
  volunteer: {
    time: number
    details: Record<string, volunteer>
  }
  deduction?: {
    total: number
    details: Record<string, deduction>
  }
  document?: {
    total: number
    details: Record<string, post>
  }
  radio?: {
    total: number
    details: Record<string, radio>
  }
  workflow: {
    total: number
    details: Record<string, workflow>
  }
  union: {
    leader: boolean
    position: 'chairman' | 'vice-chairman' | 'minister' | 'vice-minister' | 'clerk' | 'registry' | 'none'
    duty: ('deduction' | 'document' | 'radio' | 'volunteer')[]
    admin: ('deduction' | 'document' | 'radio' | 'volunteer' | 'member')[]
    view: ('deduction' | 'document' | 'radio' | 'volunteer' | 'member')[]
    department: string
    regist?: {
      plan: string
      prize: string
      position: string
    }
  }
  record: {
    actions: number
    score: number
    violation: number
  }
  password: string
}
