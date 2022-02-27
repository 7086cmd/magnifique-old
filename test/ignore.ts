import { createMarkdownParser } from '../packages/pages/src/modules/markdown/parser'
console.log(createMarkdownParser(`<script>console.log('a')</script>`))
import routeIndex from 'packages/server/src/modules/im/utils/route-index'
import createIndex from 'packages/server/src/modules/im/utils/create-index'

console.log(createIndex(routeIndex('admin')))
