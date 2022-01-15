import { contextBridge, ipcRenderer } from 'electron'

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
    describeNotification(gradeid: number, classid: number) {
        ipcRenderer.send('describe-notif', {
            classid,
            gradeid,
        })
    },
})

ipcRenderer.on('reload-page', () => {
    window.location.reload()
})
