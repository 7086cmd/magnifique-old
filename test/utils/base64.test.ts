import { expect, test, describe } from '@jest/globals'
import decodeBase64 from '../../src/modules/utils/decode-base64'
import encodeBase64 from '../../src/modules/utils/encode-base64'

describe('base64 decode test', () => {
  for (let i = 1; i <= 15; i++) {
    const val = Buffer.from(String(Math.floor(Math.random() * 342798372))).toString('base64')
    const dec = Buffer.from(val).toString('base64')
    test('Decode test for ' + dec, () => {
      expect(decodeBase64(dec)).toEqual(val)
    })
  }
})

describe('base64 encode test', () => {
  for (let i = 1; i <= 15; i++) {
    const val = Buffer.from(String(Math.floor(Math.random() * 342798372))).toString('base64')
    const dec = Buffer.from(val).toString('base64')
    test('Encode test for ' + dec, () => {
      expect(encodeBase64(val)).toEqual(dec)
    })
  }
})
