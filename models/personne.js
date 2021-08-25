


module.exports  = (Sequelize,DataTypes) => {
    const Personne =  Sequelize.define('Personne', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        name:{
            type:DataTypes.STRING,
            unique:{
                msg:"Le nom est déjà pris"
            }
        },
        age:{
            type:DataTypes.INTEGER,
        }
        // types:{
        //     type:DataTypes.STRING,
        //     allowNull: false,
        //     get(){
        //         return this.getDataValue('types').split(',')
        //     },
        //     set(){
        //         return this.setDataValue('types',types.join())
        //     }
        // }
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

    // Personne.associate = function(models) {
    //     Personne.hasMany(models.Pokemon, {as: 'Pokemon'})
    //     Pokemon.belongsTo(models.Personne, {foreignKey: 'id_personne', as: 'Personne'})
    // };

//     Personne.associate = function(models) {
//         Personne.hasMany(models.Pokemon, {as: 'Pokemon'})
//         Pokemon.belongsTo(models.Personne, {foreignKey: 'id_personne', as: 'Personne'})
//    };
      
    return  Personne

    
}
