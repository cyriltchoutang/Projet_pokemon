// SUPPRIMER UNE PERSONNE

const { Personne } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison

  
module.exports = (app) => {
  app.delete('/api/personnes/:id', auth, (req, res) => { // on passe un middleware en deuxième argument pour securiser nos points de terminaison
    Personne.findByPk(req.params.id)
    .then(personne => {   // On recupere la personne pour le retourner au client
      if(personne === null) {
        const message =`Le pokémon demandé n'existe pas`  // pb au niveau de la ressource
        return res.status(404).json({message})
      }
      const personneDeleted = personne;
      return Personne.destroy({ // On supprime la personne // return retourne la promesse (succes ou echec) de finbypk. c'est pour eviter le catch 500 entre commentaires
        where: { id: personne.id }// ou req.params.id à la place de personne.id
      })
      .then(_ => {
        const message = `La personne avec l'identifiant n°${personneDeleted.id} a bien été supprimé.`
        res.json({message, data: personneDeleted })
      })
      /*.catch(error => {
        const message = ` La personne n'a pas pu être supprimée`  //pb au niveau du serveur
        res.status(500).json({message, data:error})
      })*/
    })
    .catch(error => {
      const message = ` La personne n'a pas pu être supprimée`  //pb au niveau du serveur
      res.status(500).json({message, data:error})
    })
    
  })
}