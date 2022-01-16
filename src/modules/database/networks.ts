import { networkInterfaces } from 'os'
import type { NetworkInterfaceInfo } from 'os'

export default () => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let networks: NetworkInterfaceInfo[] = []
  const nwif = networkInterfaces()

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  for (let [_key, val] of Object.entries(nwif)) {
    if (val !== undefined) {
      for (let i = 0; i in val; i++) {
        networks.push(val[i])
      }
    }
  }
  return networks
}
