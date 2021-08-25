const { ValidationError, UniqueConstraintError } = require('sequelize')
const {Personne} = require('../db/sequelize')
const {Pokemon} = require('../db/sequelize')
const auth = require('../auth/auth')

module.exports = (app) => {
    app.post('/api/personnes', auth, (req, res) => { // on passe un middleware (auth) en deuxième argument pour securiser nos points de terminaison
      Personne.create(req.body) //Body analyse la requête (les différents types). pas vraiment
        .then(personne => {
          const message = `La personne ${req.body.name} a bien été créée.` //req.body.name = pokemon.name
          res.json({ message, data: personne })
        })
        .catch(error => {
          if(error instanceof ValidationError){ // gestion des contraintes comme les validateurss
            return res.status(400).json({message: error.message, data:error}) //Le client n'a pas envoyé les bonnes infos // error.message envoie l'info de l'erreur située dans pokemon.js
          }
          if(error instanceof UniqueConstraintError){
            return res.status(400).json({message: error.message, data:error})
          }
          const message = ` La personne n'a pas pu être créée`  //pb au niveau du serveur
          res.status(500).json({message, data:error})
        })
    })
  }


// module.exports = (app) => {
 
//     app.post('api/personnes', auth, (req,res) => {
//         res.json({ message})
//         Personne.create(req.body)
//         .then(personne => {
//             const message = `La personne ${req.body.name} a été créée.`
//             res.json({ message, data: personne})
//         })
//         .catch(error => {
//             if(error instanceof ValidationError){
//                 return res.status(400).json({message: error.message, data:error})
//             }
//             if(error instanceof UniqueConstraintError){
//                 return res.status(400).json({message:error.message, data:error})
//             }
//             const message = `La personne n'a pas pu être créée`
//             res.status(500).json({message, data:error})
//         })
//     })

// } 