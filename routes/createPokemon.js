// pour permettre aux clients de creer un pokemon à partir d'une requete http. raison pour laquelle on n'a pas utilisé notre methode created de sequelize
const { ValidationError, UniqueConstraintError } = require('sequelize') // validation metier
const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison
 
module.exports = (app) => {
  app.post('/api/pokemons', auth, (req, res) => { // on passe un middleware (auth) en deuxième argument pour securiser nos points de terminaison
    Pokemon.create(req.body) //Body analyse la requête (les différents types). retourne toutes les valeurs entrées en dehors de l'ul. exemple de valeur concernant les personnes: { name: 'Saloooo', age: 12 } 
      .then(pokemon => {
        const message = `Le pokémon ${req.body.name} a bien été crée.` //req.body.name = pokemon.name
        res.json({ message, data: pokemon })
      })
      .catch(error => {
        if(error instanceof ValidationError){ // gestion des contraintes comme les validateurss
          return res.status(400).json({message: error.message, data:error}) //Le client n'a pas envoyé les bonnes infos // error.message envoie l'info de l'erreur située dans pokemon.js
        }
        if(error instanceof UniqueConstraintError){
          return res.status(400).json({message: error.message, data:error})
        }
        const message = ` Le pokemon n'a pas pu être créé`  //pb au niveau du serveur
        res.status(500).json({message, data:error})
      })
  })
}