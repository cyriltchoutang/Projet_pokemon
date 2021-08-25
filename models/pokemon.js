const validTypes = ['Plante', 'Poisson', 'Feu', 'Eau', 'Insecte', 'Vol', 'Normal', 'Electrik', 'Fee'] // On exigera ces valeurs à nos clients

module.exports = (sequelize, DataTypes) => { // l'objet sequelize représente la connexion à notre bdd / DataTypes qui permet de defnir les types de données de chaque propriété du modèle
    const Pokemon = sequelize.define('Pokemon', {  //define permet de déclarer un modèle auprès de sequelize / on déclare le modèle pokemon et par la suite on décrit toutes ses propriétés
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false, // allownull permet de déterminer si une propiété est facultative ou non
        unique: { // On utilise ici une contrainte et plus un validateur. qui va check avec la bdd
          msg: 'Le nom est déjà pris'
        },
        validate: { // Mise en place des validateurs (permet de gerer les erreurs sans avoir à interroger les conditions de la bdd)
          notEmpty: { msg: `ne permet pas les strings vides`},
          notNull: { msg: `ne permet pas null `}
        }
      },
      hp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: { // Mise en place des validateurs (permet de gerer les erreurs sans avoir à interroger les conditions de la bdd)
          isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de vie`},
          min: {
            args: [0],
            msg: 'Les points de vie doivent être supérrieurs ou égales à 0'
          },
          max: {
            args: [999],
            msg: 'Les points de vie doivent être inférieurs ou égales à 999'
          },
          notNull: { msg: `Les points de vie sont une propriété requise. `}
        }
      },
      cp: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
        isInt: { msg: `Utilisez uniquement des nombres entiers pour les points de degats`},
        min: {
          args: [0],
          msg: 'Les points de dégâts doivent être supérrieurs ou égales à 0'
        },
        max: {
          args: [999],
          msg: 'Les points de dégâts doivent être inférieurs ou égales à 999'
        },
        notNull: { msg: `Les points de degats sont une propriété requise. `}
      }
      },
      picture: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: { // Mise en place des validateurs (permet de gerer les erreurs sans avoir à interroger les conditions de la bdd)
          isUrl: { msg: `Utilisez une URL valide`},
          notNull: { msg: `Les points de vie sont une propriété requise. `}
        }
      },
      types: {
        type: DataTypes.STRING,
        allowNull: false,
        get() {
            return this.getDataValue('types').split(',') //getdata.. recupere notre type (string) de la bdd. split nous permet d'obtenir les infos sous forme de tableau de string
        },
        set(types) {
            this.setDataValue('types', types.join()) // recupere les infos et les stocke dans la bdd sous forme de string grâce à join , qui change le tableau en string 
        },
        validate: {
          isTypesValid(value){ // Ici c'est une fonction (validateur personnalisé) et non un validateur le nom est donc aleatoire. il prend une valeur value correspondant à la valeur de la propriété type contenu en bdd donc sous forme de string et non d'un tableau. Sequelize prend directement tout en compte donc pas besoin de redeclarer la fonction ailleurs
            if(!value){
              throw new Error('Un pokémon doit au moins avoir un type') // l'erreur est levée cad que le programme s'arrêtera ici sauf s'il y'a un catch
            }
            if(value.split(',').length > 3) {
              throw new Error('Un pokémon ne peut pas avoir plus de trois types')
            }
            
          /*  value.split(',').forEach(type => {   // split car  on veut les afficher sous forme de tableau
              if(!validTypes.includes(type)) {  // check si le type est inclu dans la liste ou non
                throw new Error(`Le type d'un pokémon doit appartenir à la liste suivante: ${validTypes}`)
              }
            })*/
          }
        }
      },
      // id_personne: {
      //     type: DataTypes.INTEGER,
      //     allowNull: true,
      //     // references: {         // User belongsTo Personne 1:n
      //     //   model: 'Personne',
      //     //   key: 'id'
      //     // }
      //   }
    }, {
      timestamps: true,  // true car on souhaite modifier le comportement par defaut de notre modele sur sequelize
      createdAt: 'created', // date de création du modèle.
      updatedAt: false  // Date de modification.
    })

  //   Pokemmon.associate = function(models) {
  //     Pokemmon.belongsTo(models.Personne, {
  //         foreignKey: {
  //           allowNull: false
  //         }
  //     })     
  //  // Pokemon.belongsTo(Personne);
  //   }

    // Pokemon.associate = function(models) {
    //   Pokemon.belongsTo(models.Personne, {foreignKey: 'id_personne', as: 'Personne'})
    // };

    return Pokemon
  }
