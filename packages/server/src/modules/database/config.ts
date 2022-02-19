import { tmpdir } from 'os'
import { resolve } from 'path'
import type { NetworkInterfaceInfo } from 'os'
import packageJson from '../../../package.json'
import dayjs from 'dayjs'
import { createSdbdataParser, createSdbdataSaver } from '../utils'

export function writeData(address: NetworkInterfaceInfo[]) {
  const path = resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata')
  const { name, version, dependencies, description } = packageJson
  createSdbdataSaver(path, {
    name,
    version,
    dependencies,
    description,
    date: dayjs().toJSON(),
    address,
  })
}

export function readData() {
  return createSdbdataParser(resolve(tmpdir(), '..', 'magnifique', './magnifique.config.sdbdata'))
}
