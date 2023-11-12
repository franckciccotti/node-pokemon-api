const { User } = require('../db/sequelize')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')

// Créer la route de connexion
module.exports = (app) => {
  app.post('/api/login', (req, res) => {
  
    User.findOne({ where: { username: req.body.username } }).then(user => {

        // Gérer les erreurs de la connexion
        if(!user) {
            const message = `L'utilisateur demandé n'existe pas.`
            return res.status(404).json({ message })
        }

        bcrypt.compare(req.body.password, user.password).then(isPasswordValid => {
            if(!isPasswordValid) {
                const message = `Le mot de passe est incorrect.`;
                return res.status(401).json({ message })
            }

            // Générer un jeton JWT
            const token = jwt.sign(
                { userId: user.id },
                privateKey,
                { expiresIn: '24h'}
            )

            const message = `L'utilisateur a été connecté avec succès`;
            return res.json({ message, data: user, token })
        })
    })
    .catch(error => {
        const message = `L'utilisateur n'a pas pu être connecté. Réessayez dans quelques instants.`;
        return res.json({ message, data: error })
    })
  })
}
