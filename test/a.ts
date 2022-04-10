import { FileClient } from 'packages/pages/src/components/messages/modules/file'
const main = async () => {
  console.log(
    await new FileClient(
      {
        fileId: '',
        roomId: '',
      },
      {
        username: 'member/20201108',
        password: '',
      }
    ).fetch()
  )
}
main()
