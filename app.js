const express = require('express')
const morgan = require('morgan')
const favicon = require('serve-favicon')
const bodyParser = require('body-parser')
const { Sequelize } = require('sequelize')
const { success, getUniqueId } = require('./helper.js')
let pokemons = require('./mock-pokemon')

const app = express()
const port = 3000

const sequelize = new Sequelize(
    'pokedex',
    'root',
    'Y$fk23J7@kLx',
    {
        host: 'localhost',
        dialect: 'mariadb',
        dialectOptions: {
            timezone: 'Etc/GMT-2'
        },
        logging: false
    }
)

sequelize.authenticate()
    .then (_ => console.log('La connexion à la base de données a bien été établie.'))
    .catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))

app
    .use(favicon(__dirname + '/favicon.ico'))
    .use(morgan('dev'))
    .use(bodyParser.json())

// A la racine
app.get('/', (req, res) => res.send('Hello again, Express !'))

// Récupérer la liste de tous les pokémons
app.get('/api/pokemons', (req, res) => {
    const message = 'La liste des pokémons a bien été récupérée.'
    res.json(success(message, pokemons)) 
})

// Récupérer la liste d'un pokémon
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    const message = 'Un pokemon a bien été trouvé.'
    res.json(success(message, pokemon))
})

// Créer un pokémon
app.post('/api/pokemons', (req, res) => {
    const id = getUniqueId(pokemons)
    const pokemonCreated = { ...req.body, ...{id: id, created: new Date()}}
    pokemons.push(pokemonCreated)
    const message = `Le pokemon ${pokemonCreated.name} a bien été créé.`
    res.json(success(message, pokemonCreated))    
})

// Modifier un pokémon
app.put('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonUpdated = { ...req.body, id: id}
    pokemons = pokemons.map(pokemon => {
        return pokemon.id === id ? pokemonUpdated : pokemon
    })   
    const message = `Le pokémon ${pokemonUpdated.name} a bien été modifié.`
    res.json(success(message, pokemonUpdated))
})

// Supprimer un pokémon
app.delete('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemonDeleted = pokemons.find(pokemon => pokemon.id === id)
    pokemons = pokemons.filter(pokemon => pokemon.id !== id)
    const message = `Le pokémon ${pokemonDeleted.name} a bien été supprimé.`
    res.json(success(message, pokemonDeleted))
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))
