import fetch from 'node-fetch'
import { readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

const main = async () => {
  const response = await fetch(new URL(`https://api.github.com/repos/7086cmd/magnifique/releases`).toString())
  const data = await response.json()
  let x = false
  for (let i = 0; i in data; i++) {
    if (data[i].draft === true) {
      if (x) {
        throw 'You have over than 1 drafts.'
      }
      x = true
      const packageJson = JSON.parse(readFileSync(resolve('package.json')).toString())
      packageJson.version = data[i].name
      writeFileSync(resolve('package.json'), JSON.parse(packageJson, null, 4))
    }
  }
}

main()
