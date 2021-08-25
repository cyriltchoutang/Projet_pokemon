
module.exports  = (Sequelize,DataTypes) => {
    const Message =  Sequelize.define('Message', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:DataTypes.STRING,
        },
        contenu:{
            type:DataTypes.STRING,
        },
        // id_personne: {
        //     type: DataTypes.INTEGER,
        //     allowNull: true,
        //     // references: {         // User belongsTo Personne 1:n
        //     //   model: 'Personne',
        //     //   key: 'id'
        //     // }
        //   }

    },{
        timestamps:true,
        createdAt: 'created',
        updatedAt: false
    }

    )

    // Personne.associate = models => {
    //     Personne.hasMany(models.Pokemon, {
    //     onDelete:"CASCADE",
    //     onUpdate:"CASCADE"
    //     //foreignKey: 'clubId'
    //     })     
    //  // Pokemon.belongsTo(Personne);
    // }


    // Personne.associate = function(models) {
    //     // Users.hasOne(models.login, {
    //     //   foreignKey: 'user_id',
    //     //   as: 'loginDetails'
    //     // });
  
    //     Personne.hasMany(models.Pokemmon, {
    //         foreignKey: 'CASCADE'
    //     });
    //   };

    Message.associate = function(models) {
        Message.belongsTo(models.Personne, {foreignKey: 'id_personne', as: 'Personne'})
      };

    return  Message

    
}
