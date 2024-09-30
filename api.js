async function fetchPokemons() {
    try {
        const container = document.getElementById('pokemonContainer');
        container.innerHTML = ''; 
        
        for (let i = 1; i <= 50; i++) {
            let api = `https://pokeapi.co/api/v2/pokemon/${i}`;
            
            const response = await fetch(api, {
                method: "GET",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                }
            });
            
            const data = await response.json();
            console.log(data);
            const pokemonImg = data.sprites.front_default;
            const pokemonName = data.name;
                        
            const pokemonDiv = document.createElement('div');
            pokemonDiv.style.display = 'inline-block';
            pokemonDiv.style.textAlign = 'center';
            pokemonDiv.style.margin = '10px';
            
            const pokemonElement = document.createElement('img');
            pokemonElement.src = pokemonImg;
            pokemonElement.style.width = '150px';
            pokemonElement.style.height = '150px';
            
            const detailsLink = document.createElement('a');
            detailsLink.href = `details.html?id=${i}`;
            detailsLink.textContent = `View ${pokemonName} Details`;
            
            pokemonDiv.appendChild(pokemonElement);
            pokemonDiv.appendChild(document.createElement('br')); 
            pokemonDiv.appendChild(detailsLink);
            
            container.appendChild(pokemonDiv);
        }
    } catch (error) {
        console.error("Error fetching Pokémon data:", error);
    }
}

fetchPokemons()

function getQueryParams() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

async function fetchPokemonDetails() {
    const id = getQueryParams();  

    try {
        let api = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const response = await fetch(api, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            }
        });
        
        const data = await response.json();
        const pokemonDetails = document.getElementById('pokemonDetails');

        const types = data.types.map(type => type.type.name).join(', ');
        const abilities = data.abilities.map(ability => ability.ability.name).join(', ');
        
        let speciesResponse = await fetch(data.species.url);
        let speciesData = await speciesResponse.json();
        const speciesName = speciesData.genera.find(g => g.language.name === 'en').genus;
        const nationalNumber = speciesData.id;
        const localNumber = speciesData.pokedex_numbers.find(p => p.pokedex.name === 'national').entry_number;

        pokemonDetails.innerHTML = `
            <h2>${data.name.toUpperCase()} Details</h2>
            <img src="${data.sprites.front_default}" alt="${data.name}" style="width:200px;height:200px;">
            <p><strong>National Number:</strong> ${nationalNumber}</p>
            <p><strong>Local Number:</strong> ${localNumber ? localNumber : 'N/A'}</p>
            <p><strong>Species:</strong> ${speciesName}</p>
            <p><strong>Type:</strong> ${types}</p>
            <p><strong>Height:</strong> ${data.height / 10} meters</p>
            <p><strong>Weight:</strong> ${data.weight / 10} kg</p>
            <p><strong>Abilities:</strong> ${abilities}</p>
        `;
    } catch (error) {
        console.error("Error fetching Pokémon details:", error);
        document.getElementById('pokemonDetails').innerHTML = "Error fetching Pokémon details.";
    }
}

fetchPokemonDetails();