import yaml from 'yaml'
import json5 from 'json5'
import { resolve } from 'path'
import { readFileSync } from 'fs'

const { stringify } = yaml
const { parse } = json5

// eslint-disable-next-line no-console
console.log(stringify(parse(Buffer.from(readFileSync(resolve('config', process.argv.reverse()[0])).toString(), 'base64').toString())))
