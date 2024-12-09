document.querySelector('#trainerInfo').addEventListener('submit', generateCard);

async function fetchPokemonImage(pokemonName) {
    try {
        // Convert pokemon name to lowercase for API compatibility
        const lowercaseName = pokemonName.toLowerCase().trim();
        
        // Fetch Pokemon data from PokeAPI
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${lowercaseName}`);
        
        if (!response.ok) {
            throw new Error('Pokemon not found');
        }
        
        const data = await response.json();
        
        // Prefer official artwork, fallback to sprite
        const imageUrl = 
            data.sprites.other['official-artwork'].front_default ||
            data.sprites.front_default ||
            'https://via.placeholder.com/150?text=Pokemon+Not+Found';
        
        return imageUrl;
    } catch (error) {
        console.error('Error fetching Pokemon image:', error);
        return 'https://via.placeholder.com/150?text=Pokemon+Not+Found';
    }
}

async function generateCard(event) {
    event.preventDefault();

    // Get input and store it in variables
    const trainerName = document.getElementById('name').value.trim();
    const trainerAge = document.getElementById('age').value;
    const trainerTown = document.getElementById('town').value.trim();
    const favoritePokemon = document.getElementById('favPokemon').value.trim();
    const trainerType = document.getElementById('trainerType').value;
    
    // Generate random trainer ID
    function generateTrainerId() {
        return Math.floor(100000 + Math.random() * 900000);
    }
    const trainerId = generateTrainerId();

    // Check if all fields are filled
    if(trainerName && trainerAge && trainerTown && favoritePokemon && trainerType){
        try {
            // Fetch Pokemon image
            const pokemonImage = await fetchPokemonImage(favoritePokemon);
            
            // Create or update Pokemon image element
            let pokemonImageElement = document.getElementById('pokemonImage');
            if (!pokemonImageElement) {
                pokemonImageElement = document.createElement('img');
                pokemonImageElement.id = 'pokemonImage';
                
                // Insert the image before the trainer name
                const cardNameElement = document.getElementById('cardName');
                cardNameElement.parentNode.insertBefore(pokemonImageElement, cardNameElement);
            }
            
            // Set image properties
            pokemonImageElement.src = pokemonImage;
            pokemonImageElement.alt = `${favoritePokemon} Pokemon`;
            pokemonImageElement.classList.add('pokemon-image');

            // Update card info
            document.getElementById('cardName').textContent = trainerName;
            document.getElementById('cardAge').textContent = trainerAge;
            document.getElementById('cardTown').textContent = trainerTown;
            document.getElementById('cardFavoritePokemon').textContent = favoritePokemon;
            document.getElementById('cardTrainer').textContent = trainerType;
            document.getElementById('cardId').textContent = trainerId;
            
            // Show card
            document.getElementById('trainerCard').style.display = 'flex';
        } catch (error) {
            alert('Error generating card. Please check Pokemon name.');
        }
    } else {
        alert('Please fill in all fields');
    }
}