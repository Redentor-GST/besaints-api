import { Router } from 'express'
import SaintsService from '../services/saintsService'
import { formatDate } from '../utils/utils'

const router = Router()
const saintsService = new SaintsService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to saints router')
})

router.get('/name/:name', (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name)
    const saint = saintsService.getSaintByName(name)
    if (saint == null) {
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
    const saint = saintsService.getSaintByDate(date)
    return res.json(saint)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint by date' })
  }
})

router.get('/daily', (req, res) => {
  try {
    const saint = saintsService.getSaintByDate(formatDate(new Date()))
    return res.json(saint)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint by date' })
  }
})
