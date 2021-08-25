// SUPPRIMER UN POKEMON

const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison

  
module.exports = (app) => {
  app.delete('/api/pokemons/:id', auth, (req, res) => { // on passe un middleware en deuxième argument pour securiser nos points de terminaison
    Pokemon.findByPk(req.params.id)
    .then(pokemon => {   // On recupere le pokemon pour le retourner au client
      if(pokemon === null) {
        const message =`Le pokémon demandé n'existe pas`  // pb au niveau de la ressource
        return res.status(404).json({message})
      }
      const pokemonDeleted = pokemon;
      return Pokemon.destroy({ // On supprime le pokemon // return retourne la promesse (succes ou echec) de finbypk. c'est pour eviter le catch 500 entre commentaires
        where: { id: pokemon.id }
      })
      .then(_ => {
        const message = `Le pokémon avec l'identifiant n°${pokemonDeleted.id} a bien été supprimé.`
        res.json({message, data: pokemonDeleted })
      })
      /*.catch(error => {
        const message = ` Le pokemon n'a pas pu être supprimé`  //pb au niveau du serveur
        res.status(500).json({message, data:error})
      })*/
    })
    .catch(error => {
      const message = ` Le pokemon n'a pas pu être supprimé`  //pb au niveau du serveur
      res.status(500).json({message, data:error})
    })
    
  })
}