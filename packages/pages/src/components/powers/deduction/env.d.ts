declare interface fetchAsClass {
  gradeid: number
  classid: number
  password: string
  type: 'class'
}

declare interface fetchAsSingleMember {
  number: number
  password: string
  type: 'member'
  name: string
}

declare interface fetchAsMemberAdmin {
  number: number
  password: string
  type: 'member_admin'
}

declare interface fetchAsAdmin {
  password: string
  type: 'admin'
}

declare type fetcherOptions = fetchAsAdmin | fetchAsClass | fetchAsMemberAdmin | fetchAsSingleMember

declare interface deductionFetcherConfig {
  type: fetcherOptions['type']
  getter: string
  deleter: false | string
  creater: false | string
  callbacker: false | string
  decliner: false | string
  standardConfig: fetcherOptions
  name?: string
}
