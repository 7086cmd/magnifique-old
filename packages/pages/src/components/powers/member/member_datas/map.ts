import type Node from 'element-plus/es/components/tree/src/model/node'
import type { DragEvents } from 'element-plus/es/components/tree/src/model/useDragNode'
import type { DropType } from 'element-plus/es/components/tree/src/tree.type'
export const createEditionMap = (before: Node, after: Node, _inner: DropType, event: DragEvents) => {
  console.log(before.store.currentNode.data.value, after.parent.data.value)
}
