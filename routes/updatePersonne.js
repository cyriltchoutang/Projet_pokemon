// MODIFIER UN POKEMON
const { ValidationError, UniqueConstraintError } = require('sequelize') // validation metier
const { Personne } = require('../db/sequelize')
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison. on passe un middleware en deuxième argument pour securiser nos points de terminaison
 
// A MA FACON EN TROUVANT DABORD LID ENSUITE EN MODIFIANT.
module.exports = (app) => {  
  app.put('/api/personnes/:id', auth, (req, res) => { // on passe un middleware en deuxième argument pour securiser nos points de terminaison
    const id = req.params.id

    Personne.findByPk(id)
        .then(personne => {  // return retourne la promesse (succes ou echec) de finbypk. c'est pour eviter le catch 500 entre commentaires
          //findbypk permet de recuperer le pokemon modifié afin qu'on puisse le présenter à nos clients
        if(personne === null) {
          const message =`La personne demandée n'existe pas`  // pb au niveau de la ressource
          return res.status(404).json({message})
        } 
       // const message1 = `La personne ${personne.name} va être modifiée.` 
         // res.json({message1, data: personne })

        Personne.update(req.body, {  //Modification du pokemon
            where: { id: id }
          })

        const message = `La personne ${personne.name} a bien été modifiée.` 
          res.json({message, data: personne })
        })
        /*.catch(error => {
          const message = ` Le pokemon n'a pas pu être modifié`  //pb au niveau du serveur
          res.status(500).json({message, data:error})
        })*/
  
     // })


    // Personne.update(req.body, {  //Modification du pokemon
    //   where: { id: id }
    // })
    // .then(_ => {
    //   return Personne.findByPk(id)
    //   .then(personne => {  // return retourne la promesse (succes ou echec) de finbypk. c'est pour eviter le catch 500 entre commentaires
    //     //findbypk permet de recuperer le pokemon modifié afin qu'on puisse le présenter à nos clients
    //   if(personne === null) {
    //     const message =`La personne demandée n'existe pas`  // pb au niveau de la ressource
    //     return res.status(404).json({message})
    //   } 
    //   const message = `La personne ${personne.name} a bien été modifiée.` 
    //     res.json({message, data: personne })
    //   })
    //   /*.catch(error => {
    //     const message = ` Le pokemon n'a pas pu être modifié`  //pb au niveau du serveur
    //     res.status(500).json({message, data:error})
    //   })*/

    // })
    .catch(error => {
      if(error instanceof ValidationError){
        return res.status(400).json({message: error.message, data:error}) //Le client n'a pas envoyé les bonnes infos // error.message envoie l'info de l'erreur située dans pokemon.js
      }
      if(error instanceof UniqueConstraintError){
        return res.status(400).json({message: error.message, data:error})
      }
      const message = ` La personne n'a pas pu être modifiée`  //pb au niveau du serveur
      res.status(500).json({message, data:error})
    })
  })
}
