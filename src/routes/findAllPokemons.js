const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
  
  // Sécuriser la liste des pokémons
  app.get('/api/pokemons', auth, (req, res) => {
  // app.get('/api/pokemons', (req, res) => {

    // Ajouter une fonctionnalité de recherche
    if(req.query.name) {
      const name = req.query.name
      const limit = parseInt(req.query.limit) || 5

      // Exécuter seulement les requêtes pertinentes
      if(name.length < 2) {
        const message = `le terme de recherche doit contenir aux moins 2 caractères.`
        return res.status(400).json({ message })
      }

      // Rechercher avec l’opérateur Like - Ordonner les résultats - Limiter les résultats dynamiquement
      return Pokemon.findAndCountAll({ 
          where: { 
            name: {
              [Op.like]: `%${name}%` 
            } 
          },
          order: ['name'],
          limit: limit
      })

      // Calculer le nombre total de résultats
      .then(({count, rows}) => {
          const message = `Il y a ${count} Pokémons qui correspondent au terme de recherche ${name}.`
          res.json({ message, data: rows })
      })

    } else {

      // Ordonner les résultats
      Pokemon.findAll({ 
        // order: ['name'] 
      })

      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })
      })
      .catch(error => {
        const message = `La liste des pokémons n'a pas pu être récupérée. Réessayez dans quelques instants.`
        res.status(500).json({ message, data: error })
      })
    }
  })
}