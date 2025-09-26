import { Router } from 'express'
import PhraseService from '../services/phrasesService'

const router = Router()
const phraseService = new PhraseService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to phrases router')
})

router.get('/all', (req, res) => {
  try {
    const phrases = phraseService.getPhrases()
    return res.json(phrases)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch phrases' })
  }
})

router.get('/random', (req, res) => {
  try {
    const randomPhrase = phraseService.getRandomPhrase()
    return res.json(randomPhrase)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch random phrase' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const phrase = phraseService.getPhraseById(id)
    if (phrase == null) {
      return res.status(404).json({ error: 'Phrase not found' })
    }

    return res.json(phrase)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch phrase' })
  }
})

router.get('/author/:author', (req, res) => {
  try {
    const author = decodeURIComponent(req.params.author)
    const phrases = phraseService.getPhrasesByAuthor(author)
    return res.json(phrases)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch phrases by author' })
  }
})

router.get('/date/:date', (req, res) => {
  try {
    const date = req.params.date
    const phrases = phraseService.getPhrasesByDate(date)
    return res.json(phrases)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch phrases by date' })
  }
})

router.get('/daily', (req, res) => {
  try {
    const dailyPhrase = phraseService.getDailyPhrase()
    if (dailyPhrase == null) {
      return res.status(404).json({ error: 'No phrase found for today' })
    }
    return res.json(dailyPhrase)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch daily phrase' })
  }
})
