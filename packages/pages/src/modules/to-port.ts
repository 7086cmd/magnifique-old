export default (url: string) => {
  const uri = new URL(url)
  if (uri.protocol === 'http:') {
    uri.port = '8081'
  } else if (uri.protocol === 'https:') {
    uri.port = '8080'
  }
  return uri.toString()
}
