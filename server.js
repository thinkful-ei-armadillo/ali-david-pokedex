require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const POKEDEX = require('./pokedex.json')

const morganSetting = process.env.NODE_ENV === 'production' ? 'tiny' : 'common'
app.use(morgan(morganSetting))

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  // move to the next middleware
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})



const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
  const name = req.query.name
  const type = req.query.type
  let results = POKEDEX.pokemon

  if (req.query.name) {
  results = results.filter((item) => item.name.toLowerCase() === name.toLowerCase()) 
}
  if (req.query.type) {
  results = results.filter((item) => item.type.includes(type))
}
  res.send(results)
}

app.get('/pokemon', handleGetPokemon)

app.use((error, req, res, next) => {
  let response
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' }}
  } else {
    response = { error }
  }
  res.status(500).json(response)
})

const PORT = process.env.PORT || 8000

app.listen(PORT)
