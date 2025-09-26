<p align="center">
    <img alt="applogo" height="200" src="https://raw.githubusercontent.com/jramosss/besaints/master/assets/applogo.png">
    <h1 align="center">Be Saints API</h1>
</p>

[![codecov](https://codecov.io/gh/jramosss/besaints-api/branch/master/graph/badge.svg?token=5XGVU6XQK5)](https://codecov.io/gh/jramosss/besaints-api)

A minimalistic API for saints phrases

## Features

- **Database Integrity**: Ensures unique dates and prevents app startup if database is not populated
- **Auto-population**: Database automatically populates on each startup
- **Daily Phrases**: Get the phrase of the day based on current date
- **Comprehensive API**: Full CRUD operations for saints and phrases
- **Testing**: Complete test suite for all endpoints

## API Endpoints

### Phrases

- `GET /api/phrases/all` - Get all phrases
- `GET /api/phrases/random` - Get a random phrase
- `GET /api/phrases/daily` - Get today's phrase
- `GET /api/phrases/:id` - Get phrase by ID
- `GET /api/phrases/author/:author` - Get phrases by author
- `GET /api/phrases/date/:date` - Get phrases by date (MM-DD format)

### Saints

- `GET /api/saints/all` - Get all saints
- `GET /api/saints/:id` - Get saint by ID
- `GET /api/saints/name/:name` - Get saint by name
- `GET /api/saints/date/:date` - Get saints by date (MM-DD format)
- `GET /api/saints/search/:query` - Search saints by name or description

## Installation

```bash
npm install
```

## Development

```bash
npm run dev
```

## Testing

```bash
npm test
```

## Database

The API uses SQLite with automatic population. The database will be created and populated on first run, and the app will not start if the database is empty.

Want to contribute? [Contact me](mailto:jramostod@gmail.com)
