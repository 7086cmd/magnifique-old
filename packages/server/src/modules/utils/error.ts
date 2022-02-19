export default (err: string) => {
  return {
    status: 'error',
    reason: err,
  }
}
