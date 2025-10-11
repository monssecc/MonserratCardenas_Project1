import { createNavigation } from './navigation.js';
import { createListings } from './listings.js';

// fetch a simple list of all pokemon types (fighting, flying, etc.)
// This only includes the name and url for each.
// const response = await fetch('https://pokeapi.co/api/v2/type/?limit=100')
// const json = await response.json()

//console.log('List of Pokemon Types', json.results)

// Let's get more details for each of the types of pokemon
// this will include a list of member pokemon for each type  
// note the use of Promise.all to fetch all at once
// const pokemonTypes = await Promise.all(
//   json.results.map(async (pokemonType) => {
//     const data = await fetch(pokemonType.url)
//     return data.json()
//   })
// )
// console.log('Pokemon Types with Details', pokemonTypes)

// Now we can build the navigation menu and listings for each type
// createNavigation(pokemonTypes)
// createListings(pokemonTypes)

const booksButton = document.getElementById('books');
const shortsButton = document.getElementById('shorts');

booksButton.addEventListener('click', async () => {
  const response = await fetch('https://stephen-king-api.onrender.com/api/books');
  const json = await response.json();
  console.log('Books', json.data);
  renderBooks(json.data);
});
shortsButton.addEventListener('click', async () => {
  const response = await fetch('https://stephen-king-api.onrender.com/api/shorts');
  const json = await response.json();
  console.log('Short', json.data);
  //createListings(json.items);
});


const renderBooks = (books) => {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';
  books.forEach(book => {
    const div = document.createElement('div');
    div.classList.add('bookItem');

    // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
          const id = book.id
 // assign a unique ID to the popover accounting for pokemon having multiple types
          const popoverId = `${book.Title}-${id}`

    // the template includes a button to open the popover
    // as well as a placeholder for the popover itself.
    const iconURL = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${id}.png`
    let template =
      `<button class="open" popoverTarget="${popoverId}" >
              <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
              <span>${book.Title}</span>
              <span>${book.Year}</span>
              <img class="open" src="open.svg" />
            </button>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
    div.innerHTML = DOMPurify.sanitize(template)
    // when the popover is opened, fetch details and build a profile
    // we only do this when opened to avoid excessive API calls 
    div.querySelector(`#${popoverId}`)
      .addEventListener('toggle', async (event) => {
        if (event.newState == 'open') {
          //event.target.innerHTML = await createProfile(popoverId, item.pokemon.url)
          console.log('book clicked');
        }
      })


            
  bookList.appendChild(bookItem);
  });
}

