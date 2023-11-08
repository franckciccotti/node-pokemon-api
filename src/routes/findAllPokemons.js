const { Pokemon } = require('../db/sequelize')
const { Op } = require('sequelize')
  
module.exports = (app) => {
  app.get('/api/pokemons', (req, res) => {
    // 03. Ajouter une fonctionnalité de recherche
    if(req.query.name) {
      const name = req.query.name
      // 10. Correction : Limiter les résultats dynamiquement
      const limit = parseInt(req.query.limit) || 5

      // 12. Correction : Exécuter seulement les requêtes pertinentes
      if(name.length < 2) {
        const message = `le terme de recherche doit contenir aux moins 2 caractères.`
        return res.status(400).json({ message })
      }

      // 07. Calculer le nombre total de résultats
      // return Pokemon.findAll({ 
      return Pokemon.findCountAll({ 
          // 04. Utiliser un opérateur Sequelize
          where: { 
            name: { // 'name' est la propriété du modèle pokémon
              // [Op.eq]: name // 'name' est le critère de recherche
              // 05. Rechercher avec l’opérateur Like
              [Op.like]: `%${name}%` // 'name' est le critère de recherche
            } 
          },
          // 08. Ordonner les résultats
          order: ['name'],
          // 06. Limiter le nombre de résultats
          // limit: 5
          // 10. Correction : Limiter les résultats dynamiquement
          limit: limit
      })
      // .then(pokemons => {
      //   const message = `Il y a ${pokemons.length} Pokémons qui correspondent au terme de recherche ${name}.`
      //   res.json({ message, data: pokemons })
      // })
      // 07. Calculer le nombre total de résultats
      .then(({count, rows}) => {
          const message = `Il y a ${count} Pokémons qui correspondent au terme de recherche ${name}.`
          res.json({ message, data: rows })
      })
    } else {
      // 08. Ordonner les résultats
      Pokemon.findAll({ order: ['name'] })
      // Pokemon.findAll()
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