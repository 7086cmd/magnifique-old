import memberInformationProcess from './member-information-process'
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default (details: any) => {
  // try {
  if (details.status == 'error') {
    return details
  } else {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let base: any[] = []
    for (let i = 0; i in details.details; i++) {
      base.push(memberInformationProcess(details.details[i]))
    }
    return {
      status: 'ok',
      details: base,
    } as status
  }
  // } catch (e) {
  //   return {
  //     status: 'error',
  //     reason: 'type-error',
  //     text: <string>e,
  //   } as status
  // }
}
