import PhraseService from '../phrasesService'

describe('PhraseService Tests', () => {
  it('should return a valid random phrase', () => {
    const phraseService = new PhraseService()
    const phrase = phraseService.getRandomPhrase()
    expect(phrase).toHaveProperty('text')
    expect(phrase).toHaveProperty('author')
  })

  it('should initialize db correctly', () => {
    const phraseService = new PhraseService()
    expect(phraseService.db).toBeDefined()
  })
})
