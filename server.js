require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const app = express()
const POKEDEX = require('./pokedex.json')

app.use(morgan('dev'))

app.use(function validateBearerToken(req, res, next) {
  const authToken = req.get('Authorization')
  const apiToken = process.env.API_TOKEN
  console.log('validate bearer token middleware')
  // move to the next middleware
  if (!authToken || authToken.split(' ')[1] !== apiToken) {
    return res.status(401).json({ error: 'Unauthorized request' })
  }
  next()
})


console.log(process.env.API_TOKEN)

const validTypes = [`Bug`, `Dark`, `Dragon`, `Electric`, `Fairy`, `Fighting`, `Fire`, `Flying`, `Ghost`, `Grass`, `Ground`, `Ice`, `Normal`, `Poison`, `Psychic`, `Rock`, `Steel`, `Water`]

function handleGetTypes(req, res) {
  res.json(validTypes)
}

app.get('/types', handleGetTypes)

function handleGetPokemon(req, res) {
  const  name = req.query.name
  const  type = req.query.type
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



const PORT = 8000

app.listen(PORT, () => {
  console.log(`Server listening at http://localhost:${PORT}`)
})
