import { ElMessageBox } from 'element-plus'

export default (reason: string, text: string) => {
  if (reason === 'not-exists' || reason === 'not-exist') {
    ElMessageBox.alert('不存在操作的文件', '失败', {
      center: true,
      type: 'error',
    })
  } else if (reason == 'password-wrong') {
    ElMessageBox.alert('密码输入错误', '失败', {
      center: true,
      type: 'error',
    })
  } else if (reason == 'no-auth') {
    ElMessageBox.alert('没有权限作此事情', '失败', {
      center: true,
      type: 'error',
    })
  } else if (reason == 'type-error') {
    ElMessageBox.alert('运行获取异常： ' + text, '失败', {
      center: true,
      type: 'error',
    })
  } else {
    ElMessageBox.alert(reason, '失败', {
      center: true,
      type: 'error',
    })
  }
}
