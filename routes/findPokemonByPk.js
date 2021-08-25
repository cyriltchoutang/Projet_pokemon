// Retourne les informations d'un pokemon précis
const { Pokemon } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison
 
  
module.exports = (app) => {
  app.get('/api/pokemons/:id', auth, (req, res) => { // on passe un middleware en deuxième argument pour securiser nos points de terminaison
    Pokemon.findByPk(req.params.id) //param car le client fourni des infos passant par l'url. ex: { id: '2' }  plus besoin du parseint car finbypk effectue déjà la conversion
      .then(pokemon => {
        if(pokemon === null) {
          const message =`Le pokémon demandé n'existe pas`  // pb au niveau de la ressource
          return res.status(404).json({message})
        }
        const message = 'Un pokémon a bien été trouvé.'
        res.json({ message, data: pokemon })
      })
      .catch(error => {
        const message = ` Le pokemon n'a pas pu être récupéré`  //pb au niveau du serveur
        res.status(500).json({message, data:error})
      })
  })
}