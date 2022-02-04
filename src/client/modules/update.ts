import packageJson from '../../../package.json'
import { parse } from 'yaml'
import { Notification, shell } from 'electron'
import fetch from 'node-fetch'
const update = async () => {
  const response = await fetch('http://10.49.8.4/app/latest.yml')
  const latest = parse(await response.text())
  const {
    path,
    version,
  }: {
    path: string
    version: string
  } = latest
  if (packageJson.version !== version) {
    new Notification({
      title: '新更新',
      body: version,
    }).show()
    shell.openExternal(new URL('http://10.49.8.4/app/' + path.replaceAll('-', ' ')).toString())
  } else {
    new Notification({
      title: '无更新',
      body: version,
    }).show()
  }
}

export default update
