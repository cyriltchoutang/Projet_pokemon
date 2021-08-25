// MODIFIER UN POKEMON
const { ValidationError, UniqueConstraintError } = require('sequelize') // validation metier
const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison
 
  
module.exports = (app) => {
  app.put('/api/pokemons/:id', auth, (req, res) => { // on passe un middleware en deuxième argument pour securiser nos points de terminaison
    const id = req.params.id
    Pokemon.update(req.body, {  //Modification du pokemon
      where: { id: id }
    })
    .then(_ => {
      return Pokemon.findByPk(id)
      .then(pokemon => {  // return retourne la promesse (succes ou echec) de finbypk. c'est pour eviter le catch 500 entre commentaires
        //findbypk permet de recuperer le pokemon modifié afin qu'on puisse le présenter à nos clients
      if(pokemon === null) {
        const message =`Le pokémon demandé n'existe pas`  // pb au niveau de la ressource
        return res.status(404).json({message})
      } 
      const message = `Le pokémon ${pokemon.name} a bien été modifié.` 
        res.json({message, data: pokemon })
      })
      /*.catch(error => {
        const message = ` Le pokemon n'a pas pu être modifié`  //pb au niveau du serveur
        res.status(500).json({message, data:error})
      })*/

    })
    .catch(error => {
      if(error instanceof ValidationError){
        return res.status(400).json({message: error.message, data:error}) //Le client n'a pas envoyé les bonnes infos // error.message envoie l'info de l'erreur située dans pokemon.js
      }
      if(error instanceof UniqueConstraintError){
        return res.status(400).json({message: error.message, data:error})
      }
      const message = ` Le pokemon n'a pas pu être modifié`  //pb au niveau du serveur
      res.status(500).json({message, data:error})
    })
  })
}
