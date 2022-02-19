declare interface department {
  departments: Record<
    string,
    {
      name: string
      duty: string[]
      classes?: {
        reason: string
        deduction: number
      }[]
    }
  >
}
