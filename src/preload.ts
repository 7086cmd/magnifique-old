import { contextBridge, ipcRenderer } from 'electron'
import { networkInterfaces } from 'os'

let networks: string[] = []
const nwif = networkInterfaces()

// eslint-disable-next-line @typescript-eslint/no-unused-vars
for (let [_key, val] of Object.entries(nwif)) {
  if (val !== undefined) {
    for (let i = 0; i in val; i++) {
      if (val[i].family == 'IPv4') {
        networks.push(val[i].address)
      }
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
