import { contextBridge, ipcRenderer } from 'electron'
import { networkInterfaces } from 'os'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let networks: any[] = []
const nwif = networkInterfaces()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
for (let [_key, val] of Object.entries(nwif)) {
  if (val !== undefined) {
    for (let i = 0; i in val; i++) {
      networks.push(val[i])
    }
  }
}

contextBridge.exposeInMainWorld('magnifique', {
  closeServer() {
    ipcRenderer.send('close-main-window')
  },
  minServerWindow() {
    ipcRenderer.send('minimize-main-window')
  },
  maxServerWindow() {
    ipcRenderer.send('maximize-main-window')
  },
  isElectron: true,
  networks,
})
