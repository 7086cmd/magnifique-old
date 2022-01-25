import dataSave from '../utils/data-save'
import { tmpdir } from 'os'
import { resolve } from 'path'
import type { NetworkInterfaceInfo } from 'os'
import dataOpen from '../utils/data-open'
import packageJson from '../../../package.json'
import dayjs from 'dayjs'

export function writeData(address: NetworkInterfaceInfo[]) {
  const path = resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata')
  const { name, version, dependencies, description } = packageJson
  dataSave(path, {
    name,
    version,
    dependencies,
    description,
    date: dayjs().toJSON(),
    address,
  })
}

export function readData() {
  return dataOpen(resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata'))
}
