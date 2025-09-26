import { Router } from 'express'
import SaintsService from '../services/saintsService'
import { formatDate } from '../utils/utils'

const router = Router()
const saintsService = new SaintsService()

export default router

router.get('/', (req, res) => {
  res.send('Welcome to saints router')
})

router.get('/date/:date', (req, res) => {
  try {
    const date = req.params.date
    const saints = saintsService.getSaintByDate(date)
    return res.json(saints)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint by date' })
  }
})

router.get('/daily', (req, res) => {
  try {
    const saints = saintsService.getSaintByDate(formatDate(new Date()))
    return res.json(saints)
  } catch (error) {
    return res.status(500).json({ error: 'Failed to fetch saint by date' })
  }
})
