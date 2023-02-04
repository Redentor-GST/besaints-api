import connect from "../../db/db"
import PhraseService from "../phrasesService"

describe('PhraseService Tests', () => {
  it('should return a valid random phrase', () => {
    connect().then(_ => {
      const phraseService = new PhraseService()
      const phrase = phraseService.getRandomPhrase()
      expect(phrase).toHaveProperty('text')
      expect(phrase).toHaveProperty('author')
    })
  })

  it('should return a valid list of phrases', async () => {
    connect().then(_ => {
      const phraseService = new PhraseService()
      phraseService.getPhrases().then(phrases => {
        expect(phrases).toBeInstanceOf(Array)
        for (const phrase of phrases) {
          expect(phrase).toHaveProperty('text')
          expect(phrase).toHaveProperty('author')
        }
      })
    })
  })
})
