/* eslint-disable no-console */

import { registerSW } from 'virtual:pwa-register'
import { precacheAndRoute } from 'workbox-precaching'
declare let self: ServiceWorkerGlobalScope

if (import.meta.env.PROD) {
  precacheAndRoute(self.__WB_MANIFEST)
}

registerSW({
  onRegistered(r) {
    r && setInterval(() => r.update(), 60 * 60 * 1000)
  },
})
