import { Router } from 'express'
import PhraseService from '../services/phrasesService'

const router = Router()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to phrases router')
})

router.get('/all', (req, res) => {
  const phraseService = new PhraseService()
  const phrases = phraseService.getPhrases()
  res.send(phrases)
})

router.get('/random', (req, res) => {
  const phraseService = new PhraseService()
  const randomPhrase = phraseService.getRandomPhrase()
  res.send(randomPhrase)
})
