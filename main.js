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
  renderShorts(json.data);
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
          const popoverId =  `book-${book.handle}-${id}`

    // the template includes a button to open the popover
    // as well as a placeholder for the popover itself.
    //const iconURL = `https://cdn.vectorstock.com/i/500p/11/48/cartoon-stack-of-books-icon-vector-51211148.jpg`
    //I also removed this <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
    let template =
      `<button class="open" popoverTarget="${popoverId}" >
              <span>${book.Title}</span>
              <span>${book.Year}</span>
            </button>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
    div.innerHTML = DOMPurify.sanitize(template)
    const bookurl = `https://stephen-king-api.onrender.com/api/book/${book.id}`
    // when the popover is opened, fetch details and build a profile
    // we only do this when opened to avoid excessive API calls 
    div.querySelector(`#${popoverId}`)
      .addEventListener('toggle', async (event) => {
        if (event.newState == 'open') {
          event.target.innerHTML = await createBookProfile(popoverId, bookurl)
          console.log('book clicked');
        }
      })


            
  bookList.appendChild(div);
  });
}


//render shorts
const renderShorts = (books) => {
  const bookList = document.getElementById('bookList');
  bookList.innerHTML = '';
  books.forEach(book => {
    const div = document.createElement('div');
    div.classList.add('bookItem');

    // e.g. 25 from https://pokeapi.co/api/v2/pokemon/25/
          const id = book.id
 // assign a unique ID to the popover accounting for pokemon having multiple types
          const popoverId =  `book-${book.handle}-${id}`

    // the template includes a button to open the popover
    // as well as a placeholder for the popover itself.
    //const iconURL = `https://cdn.vectorstock.com/i/500p/11/48/cartoon-stack-of-books-icon-vector-51211148.jpg`
    //I also removed this <img src="${iconURL}" onError="this.src='pokeball.svg'"/>
    let template =
      `<button class="open" popoverTarget="${popoverId}" >
              <span>${book.title}</span>
              <span>${book.year}</span>
            </button>
            <div popover id="${popoverId}">
              <div class="profile">
                <p>Loading...</p>
              </div>
            </div>`
    div.innerHTML = DOMPurify.sanitize(template)
    const bookurl = `https://stephen-king-api.onrender.com/api/short/${book.id}`
    // when the popover is opened, fetch details and build a profile
    // we only do this when opened to avoid excessive API calls 
    div.querySelector(`#${popoverId}`)
      .addEventListener('toggle', async (event) => {
        if (event.newState == 'open') {
          event.target.innerHTML = await createShortProfile(popoverId, bookurl)
          console.log('short clicked');
        }
      })


            
  bookList.appendChild(div);
  });
}


// Given the URL for a single pokemon, fetch details from the API
// and build a profile for the pokemon. 
// this includes a template populated with details 
// it also includes a close button.
const createBookProfile = async (popoverId, url) => {
  const data = await fetch(url)
  const json = await data.json()
  const book = json.data
  //const imageURL = getProfileImageURL(book)
  // build a template to hold details for this pokemon 
  const template = ` 
  <div class="profile">
    <button class="close" popovertarget="${popoverId}"  >Close</button>
    <div class="details"> 
    
      <div class="characteristics"> 
        <h2>${book.Title}</h2>
        <h3>
          ${ book.Year}
        </h3>

      </div>
      <div>${book.villains.map(v => `<span class="villain">${v.name}</span>`).join(', ')}</div>

    </div> 
  </div>`
  return DOMPurify.sanitize(template)
}

// For shorts profile
// this includes a template populated with details 
// it also includes a close button.
const createShortProfile = async (popoverId, url) => {
  const data = await fetch(url)
  const json = await data.json()
  const book = json.data
  //const imageURL = getProfileImageURL(book)
  // build a template to hold details for this pokemon 
  const template = ` 
  <div class="profile">
    <button class="close" popovertarget="${popoverId}"  >Close</button>
    <div class="details"> 
    
      <div class="characteristics"> 
        <h2>${book.title}</h2>
        <h3>
          ${ book.year}
        </h3>

      </div>
      <div>${book.type}</div>

    </div> 
  </div>`
  return DOMPurify.sanitize(template)
}



