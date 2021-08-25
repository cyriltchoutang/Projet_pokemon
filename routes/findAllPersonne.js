const {Personne} = require('../db/sequelize')
const { Op } = require("sequelize")
const auth = require('../auth/auth')

module.exports = (app) => {
    app.get('/api/personnes', auth, (req, res) => {
        if(req.query.name){  
            const name = req.query.name
            const limit = parseInt(req.query.limit) || 5

            if(name.length<2){
                const message = 'Le message doit avoir aumoins deux caractères'
                return res.status(400).json({message})
            }

            return Personne.findAndCountAll({  
                where:  { name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                                 [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                               }
                        },
                        order: ['name'], //propriété ou on souhaite organiser les resultat // asc est ici par defaut
                        limit : limit //on use la valeur du user. limit: 5 // on ne veut pas plus de 5 affichages 
                      }) 
                .then(({count, rows}) => {  // on recupère les deux informations. c'est imortant de laisser ces noms
                  const message = ` Il y a ${count} personne qui correspondent au terme de recherche ${name}.`
                  res.json({ message, data: rows })
                })
              }
               else{  
              Personne.findAll({order: ['name']})  
                .then(personne => {
                  const message = 'La liste des personnes a bien été récupérée.'
                  res.json({ message, data: personne })   
                })
                .catch(error => {
                  const message = ` La liste des personnes n'a pas pu être recupérée`
                  res.status(500).json({message, data:error})
                }) // pas besoin de mettre le statut succes 200 car c'est le comportenment pas defaut de express
              }
    })
}