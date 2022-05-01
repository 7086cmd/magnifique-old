import { getMap } from 'packages/server/src/modules/powers/member'

const result = getMap({ type: 'department', department: 'publicity', withPosition: true })

console.log(JSON.stringify(result))
