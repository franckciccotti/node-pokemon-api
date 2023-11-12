const { Sequelize, DataTypes } = require('sequelize')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user')
const pokemons = require('./mock-pokemon')
const bcrypt = require('bcrypt')
    
let sequelize

if(process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize('zvs6nk44s2j4k42z', 'svoni8tr1z6zltr8', 'igotn85cax93jrdg', {
    host: 'cxmgkzhk95kfgbq4.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
} else {
  sequelize = new Sequelize('pokedex', 'root', 'Y$fk23J7@kLx', {
    host: 'localhost',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })
}

const Pokemon = PokemonModel(sequelize, DataTypes)
const User = UserModel(sequelize, DataTypes)
  
const initDb = () => {
  return sequelize.sync({force: true}).then(_ => {
    console.log('INIT DB')
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types
      }).then(pokemon => console.log(pokemon.toJSON()))
    })

    // Encrypter le mot de passe
    bcrypt.hash('pikachu', 10)
    .then(hash => 
      User.create({
        username: 'pikachu',
        password: hash
      })
    )
    
    .then(user => console.log(user.toJSON()))

    console.log('La base de donnée a bien été initialisée !')
  })
}
  
module.exports = { 
  initDb, Pokemon, User
}
