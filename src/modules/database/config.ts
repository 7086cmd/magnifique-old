import { readFileSync } from 'fs'
import dataSave from '../utils/data-save'
import { tmpdir } from 'os'
import { resolve } from 'path'
import type { NetworkInterfaceInfo } from 'os'
import dataOpen from '../utils/data-open'

export function writeData(version: string, address: NetworkInterfaceInfo[]) {
  const path = resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata')
  const packagen = JSON.parse(readFileSync(resolve('package.json')).toString())
  dataSave(path, {
    ...packagen,
    address,
  })
}

export function readData() {
  return dataOpen(resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata'))
}
