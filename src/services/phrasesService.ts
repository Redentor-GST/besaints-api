import { Phrase } from '../types'
import phrases from '../db/phrases.json'

export default class PhraseService {
  getPhrases = (): Phrase[] => phrases

  getRandomPhrase = (): Phrase => {
    const randomIndex = Math.floor(Math.random() * phrases.length)
    return phrases[randomIndex]
  }
}
