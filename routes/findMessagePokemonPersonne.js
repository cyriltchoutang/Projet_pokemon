const {Personne} = require('../db/sequelize')
const {Message} = require('../db/sequelize')
const {Pokemon} = require('../db/sequelize')
const { Op } = require("sequelize")
const auth = require('../auth/auth')


// Ici on implémente hastomany et belongtomany avec une personne qui peut avoir des messages et des pokemons, et des pokemons qui ont des personnes
module.exports = (app) => {
    app.get('/api/personnesmessagespokemons', auth, (req, res) => {
        if(req.query.name){  
            const name = req.query.name
            const limit = parseInt(req.query.limit) || 5

            if(name.length<2){
                const message = 'Le message doit avoir aumoins deux caractères'
                return res.status(400).json({message})
            }

            return Personne.findAndCountAll({  

                /////////////////// Methode de message ///////////////////////////

                // include: {  // si on met un where dans l'include, il s'appliquera juste sur le tableau inclu. ex: name = nom de la tableet non de personne
                //     model: Message,
                //     as: 'Message',
                //     required: true, // Pour le inner join
                //     }, 

                //////////////////// Methode de personne-pokemon///////////////////////////

                include: {  // si on met un where dans l'include, il s'appliquera juste sur le tableau inclu. ex: name = nom de la table et NON de personne
                    model: Pokemon,
                    required: true, // Pour le inner join
                    
                    through: {
                        // where: {
                        //   // Here, `completed` is a column present at the junction table
                        //   completed: true
                        // }
                    }

                    
                    }, 

                where:  { 
                          name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                                    [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                               }
                },
                order: ['name'], //propriété ou on souhaite organiser les resultat // asc est ici par defaut
                limit : limit, //on use la valeur du user. limit: 5 // on ne veut pas plus de 5 affichages 
                    
                }) 
                .then(({count, rows}) => {  // on recupère les deux informations. c'est imortant de laisser ces noms
                  const message1 = ` Il y a ${count} personne qui correspondent au terme de recherche ${name}.`
                  res.json({ message1, data: rows })
               
                })
                
              }
               else{  
              Personne.findAll({
                include: {  // si on met un where dans l'include, il s'appliquera juste sur le tableau inclu. ex: name = nom de la tableet non de personne
                    model: Message,
                    as: 'Message',
                    required: true, // Pour le inner join
                    },   
                order: ['name']})  
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