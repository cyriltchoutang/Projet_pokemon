// LISTE DES POKEMONS
const { Pokemon } = require('../db/sequelize')  // importe dans le point de terminaison du modele pokemon
//const { Op } = require('sequelize') //Importe les opérateurs de sequelize
const { Op } = require("sequelize") // api fluide permettant de gerer les select, oderby, where,..
const auth = require('../auth/auth') // C'est pour sécuriser ce point de terminaison.
const e = require('cors')

module.exports = (app) => { //exporte une fonction qui prend en parametre toute l'application express. C'est pour pouvoir definir les routes plus simplement
  app.get('/api/pokemons', auth, (req, res) => {  // on passe un middleware en deuxième argument pour securiser nos points de terminaison

      if(req.query.name){  // effectuer une recherche par le nom. ensuite on teste avec http://localhost:3000/api/pokemons?name=nomrecherché. On use query car on utilise pas un slash mais un ?name. exemple { name: 'tas' }.
      const name = req.query.name // permet d'indiquer à express que l'on souhaite extraire le paramètre name de l'url. c'est unpeu comme l'url ou on utilise plutôt param 
      const limit = parseInt(req.query.limit) || 5 // soit la limite transmise par le user, soit 5 par defaut // on converti la chaine de caractere transmise par express. req.query.limit : ce limit est affiché dans l'url donc on pouvait meme ecrire limite
      
      if(name.length <2){
        const message = `Le terme de recherche doit contenir au moins 2 caractères`
        return res.status(400).json({message})
      }
      /*return Pokemon.findAll({ 
      where:  { name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                       [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                     }
              },
              limit: 5 // on ne veut pas plus de 5 affichages 
            }) 
      .then(pokemons => {
        const message = ` Il y a ${pokemons.length} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: pokemons })
      })*/
      /* return Pokemon.findAndCountAll({  //cherche 2 choses: le nombre total de resultat, et les resultats demandés (limité à 5). Il pourra donc avoir 10 pokémons, cependant on affcihera le nombre total (numéro) mais le nombre de pokémon dans les contraintes (limit 5 ex)
      where:  { name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                       [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                     }
              },
              limit: 5 // on ne veut pas plus de 5 affichages 
            }) 
      .then(({count, rows}) => {  // on recupère les deux informations
        const message = ` Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: rows })
      })*/
    /*   return Pokemon.findAndCountAll({  // alphabetique
      where:  { name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                       [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                     }
              },
              order: ['name'], //propriété ou on souhaite organiser les resultat // asc est ici par defaut
              limit: 5 // on ne veut pas plus de 5 affichages 
            }) 
      .then(({count, rows}) => {  // on recupère les deux informations
        const message = ` Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: rows })
      }) */

      // Pour être précis
      // Model.findAll({
      //   attributes: ['foo', 'bar']
      // });
      // SELECT foo, bar FROM ...
     
          return Pokemon.findAndCountAll({  // retourne les pokemons et les comptent
      where:  { name:{  // name est la propriété // utilisation des opérateurs pour les critères de recherche
                       [Op.like]:`%${name}%` // name : critère de recherche // oper like cft SQL 
                     }
              },
              order: ['name'], //propriété ou on souhaite organiser les resultat // asc est ici par defaut
              limit : limit //on use la valeur du user. limit: 5 // on ne veut pas plus de 5 affichages 
            }) 
      .then(({count, rows}) => {  // on recupère les deux informations issues de findcount (count pour le nombre et rows pour l'affichage des pokemons)
        const message = ` Il y a ${count} pokémons qui correspondent au terme de recherche ${name}.`
        res.json({ message, data: rows })
      })
    }
     else{  // mais on n'était pas obligé de mettre elseavec le return dans le if il devait une fois sortir
    Pokemon.findAll({order: ['name']})  // methode qui retourne la liste des pokemons par ordre croissant
      .then(pokemons => {
        const message = 'La liste des pokémons a bien été récupérée.'
        res.json({ message, data: pokemons })   // On retourne notre reponse. le pokemons après then est le même qui va vers data
      })
      .catch(error => {
        const message = ` La liste des pokémons n'a pas pu être recupérée`
        res.status(500).json({message, data:error})
      }) // pas besoin de mettre le statut succes 200 car c'est le comportenment pas defaut de express
    }
  })
}