const jwt = require('jsonwebtoken')
const privateKey = require('../auth/private_key')
  
module.exports = (req, res, next) => {
  const authorizationHeader = req.headers.authorization // On recupère l'entête authorization

  if(!authorizationHeader) {  // On vérifie que le jeton jwt a été fournit
    const message = `Vous n'avez pas fourni de jeton d'authentification. Ajoutez-en un dans l'en-tête de la requête.`
    return res.status(401).json({ message })
  }
    
    const token = authorizationHeader.split(' ')[1] // On recupère le jeton jwt envoyé par le user.  On use cette fonction car authorization = bearer <jwt>. il faut donc uniquement recupérer jwt d'où split...[1]//
    //const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsImlhdCI6MTYyMDcwMDU4MywiZXhwIjoxNjIwNzg2OTgzfQ.RvasBDUlvmklJKUEBBqt2J_Ar3pNqGcr0-6WtQ6SsNI"
  
    const decodedToken = jwt.verify(token, privateKey, (error, decodedToken) => {  // On vérifie ici si le jeton est valide
    
      if(error) {
      const message = `L'utilisateur n'est pas autorisé à accèder à cette ressource.`
      return res.status(401).json({ message, data: error })
    }
  
    const userId = decodedToken.userId
    if (req.body.userId && req.body.userId !== userId) {
      const message = `L'identifiant de l'utilisateur est invalide.`
      res.status(401).json({ message })
    } else {
      next() // On le laissera accéder au point de terminaison qu'il a demandé car tout est OK
    }
  })
}