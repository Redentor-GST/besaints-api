import express from 'express'
import connect from './db/db'
import phrasesRouter from './routes/phrasesRouter'
import saintsRouter from './routes/saintsRouter'
import userRouter from './routes/userRouter'

export const app = express()
app.use(express.json())
app.set('json spaces', 2)

const PORT = 3000

app.get('/', (req, res) => {
  res.send('OK')
})

// Initialize database connection and ensure it's populated
export async function initializeDatabase (): Promise<void> {
  try {
    console.log('Initializing database connection...')
    const db = connect()
    app.locals.db = db

    // Verify database is properly populated
    console.log('Verifying database population...')
    const saintsCount = db
      .prepare('SELECT COUNT(*) as count FROM saints')
      .get() as { count: number }
    const phrasesCount = db
      .prepare('SELECT COUNT(*) as count FROM phrases')
      .get() as { count: number }

    if (saintsCount.count === 0 || phrasesCount.count === 0) {
      console.error(
        'ERROR: Database is not properly populated. Cannot start server.'
      )
      console.error(`Saints count: ${saintsCount.count}, Phrases count: ${phrasesCount.count}`)
      process.exit(1)
    }

    console.log(
      `✅ Database verified: ${saintsCount.count} saints, ${phrasesCount.count} phrases`
    )
  } catch (error) {
    console.error('❌ ERROR: Failed to initialize database:', error)
    throw error
  }
}

// Initialize app with routes
export async function initializeApp (): Promise<void> {
  await initializeDatabase()

  // Add routes
  app.use('/phrases', phrasesRouter)
  app.use('/saints', saintsRouter)
  app.use('/user', userRouter)
}

// Start the server (only when not in test environment)
async function startServer (): Promise<void> {
  try {
    await initializeApp()

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📊 Database: SQLite (${process.env.NODE_ENV === 'test' ? 'test.sqlite' : 'database.sqlite'})`)
      console.log(`🌍 Environment: ${process.env.NODE_ENV ?? 'development'}`)
    })
  } catch (error) {
    console.error('❌ ERROR: Failed to start server:', error)
    process.exit(1)
  }
}

// Start the application only if not in test mode
if (process.env.NODE_ENV !== 'test') {
  startServer().catch((error) => {
    console.error('❌ Unhandled error during server startup:', error)
    process.exit(1)
  })
}
