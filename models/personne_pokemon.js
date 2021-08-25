
module.exports = (Sequelize,DataTypes) => {
    const Personne_pokemon = Sequelize.define('Personne_pokemon',{
        status: DataTypes.STRING
        
    },{});

    return Personne_pokemon
}