import yaml from 'yaml'
import json5 from 'json5'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const { parse } = yaml
const { stringify } = json5

// eslint-disable-next-line no-console
console.log(Buffer.from(stringify(parse(readFileSync(resolve('config', process.argv.reverse()[0])).toString()))).toString('base64'))
