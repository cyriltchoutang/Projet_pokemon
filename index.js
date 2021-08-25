// ca c'est pour JS. CA NE FAIT PAS PARTI DU PROJET NODEJS. C'est juste pour la partie front end
// attention il est en prod
import "./styles.css";

// Step 1 : "Hello, Heroku ! 👋"
//fetch("https://cryptic-sands-41262.herokuapp.com/") // api native qui permet d'effectuer les requêtes reseaux sans avoir de dependances ou de paquet à installer
fetch("http://localhost:3000/")
  .then((res) => res.json())  // on effectue une reqête auprès de l'api rest, on la convertion en json , et on la stocke dans la console
  .then((res) => console.log(res));

// Step 2 : "Get JWT token 🔓"
fetch("http://localhost:3000/api/login", {
  method: "POST",  //Ici on effectue l'authentification
  body: JSON.stringify({ username: "pikachu", password: "pikachu" }),
  headers: { "Content-type": "application/json" }
})
  .then((res) => res.json())
  .then((res) => {
    console.log(res);
    return res.token;
  })
  .then((token) => fetchPokemonlist(token)); // on transfert le jeton à fetchpokemonlist pour pouvoir recuperer la liste des pokemons
  console.log(req)
// Step 3 : "Get pokemon list 🎉"
const fetchPokemonlist = (token) => {
  fetch("http://localhost:3000/api/pokemons", {
    headers: { Authorization: `Bearer ${token}` }  // ne pas oublier AUTHORIZATION, sinon le jeton sera rejété
  })
    .then((res) => res.json())
    .then((res) => console.log(res));
};