const express = require('express')
let pokemons = require('./mock-pokemon') //04 Mettre en place un vrai jeu de données

const app = express()
const port = 3000
  
app.get('/', (req, res) => res.send('Hello again, Express !'))

// 01 Découvrir les bases concernant les routes
app.get('/api/pokemons/1', (req, res) => res.send('Hello, Bulbizarre !'))

// 02 Passer un paramètre depuis l’url 
app.get('/api/pokemons/:id', (req, res) => {
    const id = req.params.id
    res.send(`Vous avez demandé le pokémon n°${id}`)
})
  
// 04 Mettre en place un vrai jeu de données
app.get('/api/pokemons/:id', (req, res) => {
    const id = req.params.id
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    res.send(`Vous avez demandé le pokémon n°${pokemon.name}`)
})

// 05 Relier nos données et les routes d’Express
app.get('/api/pokemons/:id', (req, res) => {
    const id = parseInt(req.params.id)
    const pokemon = pokemons.find(pokemon => pokemon.id === id)
    res.send(`Vous avez demandé le pokémon n°${pokemon.name}`)
})

// 07 Correction : Créer un nouveau endpoint
// Le nouveau point de terminaison, affichant le nombre total de pokémons :
app.get('/api/pokemons', (req, res) => {
    res.send(`Il y a ${pokemons.length} pokémons dans le pokédex pour le moment. `)
})

app.listen(port, () => console.log(`Notre application Node est démarrée sur : http://localhost:${port}`))