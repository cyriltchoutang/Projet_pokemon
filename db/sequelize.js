//const { Sequelize, DataTypes } = require('sequelize')
const {Sequelize, DataTypes} = require('sequelize') // importe les données et types de sequelize
//const PokemonModel = require('../models/pokemon')
const PokemonModel = require('../models/pokemon')
const UserModel = require('../models/user') // recupère le modèle user
const PersonneModel = require('../models/personne')
const MessageModel = require('../models/message')
const Personne_pokemonModel = require('../models/personne_pokemon')
//const pokemons = require('./mock-pokemon')
const pokemons = require('./mock-pokemon') // on importe notre liste de pokemon  
const bcrypt = require('bcrypt') // importer le module bcrypt pour le cryptage


/*const sequelize = new Sequelize('pokedex', 'root', '', {
  host: 'localhost',
  dialect: 'mariadb',
  dialectOptions: {
    timezone: 'Etc/GMT-2',
  },
  logging: false
})*/
// Connexion de sequelize à la base de données. pokedex est le nom de la BD
/*const sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    dialectOptions: { 
      timezone: 'Etc/GMT-2',
    },
    logging: false
  })  */

  let sequelize

if(process.env.NODE_ENV === 'production') {
  sequelize = new Sequelize('kk8u5y871hfoaw9y', 't09tvm6qofrtvc7h', 'ryujse9ftf40wpqn', {
    host: 'klbcedmmqp7w17ik.cbetxkdyhwsb.us-east-1.rds.amazonaws.com',
    dialect: 'mariadb',
    dialectOptions: {
      timezone: 'Etc/GMT-2',
    },
    logging: true
  })
} else {
  sequelize = new Sequelize('pokedex', 'root', '', {
    host: 'localhost',
    dialect: 'mysql',
    // dialectOptions: {
    //   timezone: 'Etc/GMT-2',
    // },
    logging: true
  })
}






//const Pokemon = PokemonModel(sequelize, DataTypes)
const Pokemon = PokemonModel(sequelize, DataTypes) //Instanciation de notre objet (model)  
const User = UserModel(sequelize, DataTypes) // Instancie le model user
const Personne = PersonneModel(sequelize,DataTypes)
const Message = MessageModel(sequelize,DataTypes)
const Personne_pokemon = Personne_pokemonModel(sequelize,DataTypes)

/// One to many /////
Personne.hasMany(Message, {as: 'Message'}) // ou 
//Message.belongsTo(Personne, {foreignKey: 'id_personne', as: 'Personne'})  // Mais apparement en l'utilisant il faut creer les clés secondaires dans les tables car on ne voit pas les valeurs apparaître dans la bdd
//Pokemon.belongsTo(Personne, {foreignKey: 'id_personne', as: 'Personne'})
////////////

//// Many to manyyy ////
//Personne_pokemon.belongsTo(Personne, {foreignKey: 'personne_id'})
//Personne_pokemon.belongsTo(Pokemon, {foreignKey: 'pokemon_id'})

Pokemon.belongsToMany(Personne, {through: 'Personne_pokemon', constraints: false })
Personne.belongsToMany(Pokemon, {through: 'Personne_pokemon', constraints: false }) // contraints pour eviter les problemes de cascade. Ca mettra restreint
///////////////////////


/*const initDb = () => {
  return sequelize.sync({force: true}).then(_ => {
    pokemons.map(pokemon => {
      Pokemon.create({
        name: pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        types: pokemon.types.join()
      }).then(pokemon => console.log(pokemon.toJSON()))
    })
    console.log('La base de donnée a bien été initialisée !')
  })
}*/

// test afin de savoir si sequelize s'est bien connecté à notre BD
sequelize.authenticate()
.then(_ => console.log('La connexion à la base de données a bien été établie.'))
.catch(error => console.error(`Impossible de se connecter à la base de données ${error}`))


///  ne pas oublier de decommenter sequelize.initDb() dans app.js pour appeler la synchro à la bdd
const initDb = () => {  // attention il reinitialise la bdd donc si vous voulez ajoute une nouvelle table, juste mettre un deuxieme synchro en bas. ou mettre les tables déjà créées entre parentheses
return sequelize.sync({force: true}) // synchronisation avec la bdd grace à la méthode sync. Force à True permet de supprimer complètement la table associée à chaque modèle (en gros supprime les données de la table. Comme on développe on préfere ppartir sur des données neuves mais avec le temps, ça ne sera plus utile) 
//return sequelize.sync()  // le plus appro car il cree une new table ssi elle n'existe pas
.then(_=> {
      console.log('La base de données a été synchronisée')
     
      pokemons.map(pokemon =>{
      Pokemon.create({  // creation des 12 pokemons dans notre bdd
        name:pokemon.name,
        hp: pokemon.hp,
        cp: pokemon.cp,
        picture: pokemon.picture,
        //types: pokemon.types.join() //types est string en bdd, mais coté api rest les types sont un tableau de string. JOIN permet donc de creer une nouvelle chaine de caractère unique, en concatenant tous les éléments du tableau séparés par une virgule. SPLIT, methode JS permet de remettre sous forme de tableau
        types: pokemon.types, //plus besoin de join car on a fait ce taff dans les getters et setters dans pokemon.js
      }).then(pokemon => console.log(pokemon.toJSON())) // il permet d'afficher que les valeurs des champs de la table qui nous interesse
      })

      Personne.bulkCreate([
        {name: 'John',  age:17},
        {name: 'cyril', age: 18},
        {name: 'manuel', age: 19}
      ])
      .then((newPersonne) => {
        console.log(newPersonne)
      })
      .catch((err) => {
        console.log("Error while users creation : ", err)
      })

      Message.bulkCreate([
        {name: 'pinokio', contenu: "j''ai un long nez", PersonneId:2},
        {name: 'alice au pays des merveilles', contenu: "je m''appelle alice et je suis belle",  PersonneId:3},
        {name: 'Game of throne', contenu: 'je suis la mère des dragons',  PersonneId:3}
      ])
      .then((newMessage) => {
        console.log(newMessage)
      })
      .catch((err) => {
        console.log("Error while users creation : ", err)
      })

      Personne_pokemon.bulkCreate([
        {status: 'je confirme mon petit', PokemonId:2, PersonneId:1},
        {status: 'le petit est vif', PokemonId:4, PersonneId:1},
        {status: 'ya koi', PokemonId:2, PersonneId:2}
      ])
      .then((newPersonne_pokemon) => {
        console.log(newPersonne_pokemon)
      })
      .catch((err) => {
        console.log("Error while users creation : ", err)
      })

      bcrypt.hash('pikachu',10) // elle prend 2 paramètres. le mot de passe en lui meme ; pikachu. ensuite le sizerule: c'est le temps nécessaire pour hasher un mdp. plus il est élevé plus il est difficile de hacker
      .then(hash => {   // on recupère le mot de passe crypté ici
          User.create({ // on pousse un user dans notre bdd
          username: 'pikachu',
          password: hash  // on pousse e mot de passe crpté dans la bdd
          })
      })
      //.then(user => console.log(user.toJSON()))

      

      console.log('La base de donnée a bien été initialisée')

    })

   
} 

module.exports = { 
 initDb, Pokemon, User, Personne, Message, Personne_pokemon  // permet d'initialiser la bdd et le modèle sequelize. Le but est de pouvoir l'utiliser ailleur
}