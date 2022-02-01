import { defineStore } from 'pinia'

const ClassStore = defineStore('class-store', {
  state: () => ({
    logined: false,
    info: {
      gradeid: 0,
      classid: 0,
      password: '',
    },
  }),
  actions: {
    login: (info: { gradeid: number; classid: number; password: string }) => {
      this.info = info
    },
  },
})

export default ClassStore
