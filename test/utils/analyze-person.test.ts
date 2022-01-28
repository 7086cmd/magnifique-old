import { expect, test, describe } from '@jest/globals'
import analyzePerson from '../../src/modules/utils/analyze-person'

describe('Person Analyze Test', () => {
  for (let i = 1; i <= 20; i++) {
    const personnum = Math.floor(Math.random() * 100000000)
    test('Person test for ' + String(personnum), () => {
      const result = analyzePerson(personnum)
      expect(result).toEqual({
        gradeid: Math.floor(personnum / 10000),
        classid: Math.floor((personnum % 10000) / 100),
        number: Math.floor(personnum % 100),
      })
    })
  }
})
