import { ElMessageBox } from 'element-plus'

export default () => {
  ElMessageBox.alert('操作成功', '成功', {
    center: true,
    type: 'success',
  })
}
