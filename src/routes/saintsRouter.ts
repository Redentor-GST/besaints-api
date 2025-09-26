import { Router } from 'express'
import SaintsService from '../services/saintsService'

const router = Router()
const saintsService = new SaintsService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to saints router')
})

router.get('/all', (req, res) => {
  try {
    const saints = saintsService.getSaints()
    return res.json(saints)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saints' })
  }
})

router.get('/:id', (req, res) => {
  try {
    const id = parseInt(req.params.id)
    if (isNaN(id)) {
      return res.status(400).json({ error: 'Invalid ID' })
    }

    const saint = saintsService.getSaintById(id)
    if (!saint) {
      return res.status(404).json({ error: 'Saint not found' })
    }

    return res.json(saint)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint' })
  }
})

router.get('/name/:name', (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name)
    const saint = saintsService.getSaintByName(name)
    if (!saint) {
      return res.status(404).json({ error: 'Saint not found' })
    }
    return res.json(saint)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint by name' })
  }
})

router.get('/date/:date', (req, res) => {
  try {
    const date = req.params.date
    const saints = saintsService.getSaintsByDate(date)
    return res.json(saints)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saints by date' })
  }
})

router.get('/search/:query', (req, res) => {
  try {
    const query = decodeURIComponent(req.params.query)
    const saints = saintsService.searchSaints(query)
    return res.json(saints)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to search saints' })
  }
})
