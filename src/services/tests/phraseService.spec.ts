import PhraseService from '../phrasesService'

describe('PhraseService Tests', () => {
  it('should return a valid random phrase', () => {
    const phraseService = new PhraseService()
    const phrase = phraseService.getRandomPhrase()
    expect(phrase).toHaveProperty('text')
    expect(phrase).toHaveProperty('author')
  })
})
