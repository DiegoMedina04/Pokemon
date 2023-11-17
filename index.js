let pokemonsArray;
let offset = -100,
  limit = 0;
function showTypes(pokemons) {
  const container = $(".types_pokemons");
  const typesPokemons = [
    ...new Set(pokemons.map((pokemon) => pokemon.types[0].type.name)),
  ];
  typesPokemons.push("todos");
  typesPokemons.forEach((type) =>
    container.append(
      `<button type="submit" class="tipe_pokemon" id="${type}">${type}</button>`
    )
  );
}

function showPokemons(pokemons) {
  const container = $("#pokemon-container");
  container.empty();
  const pokemonElement = $("<div>");

  pokemons.forEach((pokemon) => {
    pokemonElement.append(
      `<p> ${pokemon.id} ${pokemon.name.toUpperCase()}</p>`
    );
    pokemonElement.append(
      `<img width="100px" heigth="100px" src="${pokemon.sprites.other.dream_world.front_default}" alt="${pokemon.name}">`
    );
  });
  container.append(pokemonElement);
}
async function getPokemonsArray(getPokemons) {
  const linksPokemons = getPokemons.results.map(({ url }) => fetch(url));
  const responses = await Promise.all(linksPokemons);
  return await Promise.all(
    responses.map(async (response) => await response.json())
  );
}

async function getPokemonsApi() {
  (offset += 100), (limit += 100);
  return await fetch(
    `https://pokeapi.co/api/v2/pokemon?offset=${offset}&limit=${limit}`
  )
    .then(async (response) => await response.json())
    .catch((err) => console.log(err));
}

function showOptionsInput(pokemons) {
  const pokemonNames = pokemons.map((pokemon) => pokemon.name);

  $.each(pokemonNames, (index, value) =>
    $("#options_pokemons").append('<option value="' + value + '"></option>')
  );
}

async function getPokemons() {
  const getPokemons = await getPokemonsApi();
  const pokemons = await getPokemonsArray(getPokemons);
  pokemonsArray = pokemons;
  showPokemons(pokemons);
  showTypes(pokemons);
  showOptionsInput(pokemons);
}

$(document).ready(async function (e) {
  getPokemons();
});

$(".traerMas").on("click", function (e) {
  e.preventDefault();
  getPokemons();
});

$("#buscar_pokemon").on("input", function () {
  var valorInput = $(this).val();
  const response = pokemonsArray.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(valorInput)
  );

  if (!response.length) {
    response.push({
      name: "Pokemon no encontrado",
      sprites: {
        other: {
          dream_world: { front_default: "https://via.placeholder.com/640x360" },
        },
      },
    });
  }

  showPokemons(response);
});

$(".types_pokemons").on("click", ".tipe_pokemon", function (e) {
  e.preventDefault();
  const type = $(this).attr("id");
  const response =
    type == "todos"
      ? pokemonsArray
      : pokemonsArray.filter((pokemon) => pokemon.types[0].type.name == type);

  showPokemons(response);
});
