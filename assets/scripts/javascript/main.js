const pokemonName = document.querySelector('.pokemon-name');
const pokemonNumber = document.querySelector('.pokemon-number');
const pokemonImage = document.querySelector('.pokemon');

pokemonImage.addEventListener('error', () => {
    pokemonImage.src = 'default-image-url.png'; // Define a imagem padrão ao ocorrer um erro
});

const search = document.querySelector('.search');
const input = document.querySelector('.input-search');
const buttonPrev = document.querySelector('.btn-prev');
const buttonNext = document.querySelector('.btn-next');

let searchPokemon = 1;

const fetchPokemon = async (pokemon) => {
    const APIResponse = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`);

    if (APIResponse.status == 200) {
        const data = await APIResponse.json();
        return data;
    } else {
        return null; // Retorna null se a resposta não for 200
    }
};

const fetchAlternativeSprite = async (pokemonId) => {
    // Exemplo de fonte alternativa
    const alternativeSpriteURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;
    const response = await fetch(alternativeSpriteURL);

    if (response.ok) {
        return alternativeSpriteURL;
    } else {
        return 'default-image-url.png'; // Define a imagem padrão se não encontrar na fonte alternativa
    }
};

const renderPokemon = async (pokemon) => {
    pokemonName.innerHTML = 'Carregando...';
    pokemonNumber.innerHTML = '';
    const data = await fetchPokemon(pokemon);

    if (data) {
        pokemonName.innerHTML = data.name;
        pokemonNumber.innerHTML = data.id;

        let sprite = data.sprites.versions['generation-viii'].icons.front_default;
        if (!sprite) {
            // Se não encontrar a sprite na PokeAPI, busca na fonte alternativa
            sprite = await fetchAlternativeSprite(data.id);
        }

        pokemonImage.src = sprite;
        pokemonImage.style.display = 'block';

        input.value = '';
        searchPokemon = data.id; // Atualiza searchPokemon com o ID atual

    } else {
        pokemonImage.style.display = 'none';
        pokemonName.innerHTML = 'Pokémon não existe';
        pokemonNumber.innerHTML = '';
        console.error('Pokémon não encontrado');
    }
};

search.addEventListener('submit', (event) => {
    event.preventDefault();
    renderPokemon(input.value.toLowerCase());
});

buttonPrev.addEventListener('click', () => {
    if (searchPokemon > 1) {
        searchPokemon -= 1;
        renderPokemon(searchPokemon);
    }
});

buttonNext.addEventListener('click', () => {
    searchPokemon += 1;
    renderPokemon(searchPokemon);
});

renderPokemon(searchPokemon);
