export const decode = (data: string) => {
  return JSON.parse(window.atob(data))
}

export const encode = (data: object) => {
  return window.btoa(JSON.stringify(data))
}
