export default (
  error: string
): {
  status: 'error'
  reason: string
} => {
  return {
    status: 'error',
    reason: error,
  }
}
