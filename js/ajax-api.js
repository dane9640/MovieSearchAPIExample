/*
Project API:
omdbapi.com
http://www.omdbapi.com/?apikey=[yourkey]&

API Key: d00f2a4c

Lazy Loading tutorial for API calls:
https://medium.com/@kennethscoggins/how-to-use-the-infinite-scrolling-method-in-javascript-to-manage-large-api-result-sets-b8f78dba66fb
*/
init();

function init() {
  submitSearchTerm();
}

/*
 * Builds URL string from user's search term/phrase
 *
 */
function submitSearchTerm(){
  
  const SEARCH_BUTTON = document.querySelector('input[type="submit"]');
  
  SEARCH_BUTTON.addEventListener('click', (e) => {
    e.preventDefault();

    const API_KEY = 'd00f2a4c';
    const URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;

    var searchTerm = `s=${document.querySelector('#search').value}`;
    createRequest(`${URL}${searchTerm}`, searchSuccess, searchError);
  });
}

/*
 * Creates fetch request
 *
 */
function createRequest(url, succeed, fail){
  console.log(url)
  fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data))
    .catch((error) => fail(error));
}

/*
 * Handles fetch errors
 *
 */
function handleErrors(response){
  
  if(!response.ok){
    throw('fail');
  }
  return response.json();
}

/*
 * Updates DOM on a successful search, including 'no movies found'
 *
 */
function searchSuccess(data){
  const SEARCH_TERM = document.querySelector('#search').value
  const HR = document.querySelector('hr');

  if(document.querySelector('#resultSection')){
    var resultSection = document.querySelector('#resultSection');
  } else {
    var resultSection = document.createElement('section');
    resultSection.setAttribute('id', 'resultSection');
  }

  var h2 = document.createElement('h2');

  if(!data.totalResults){
    h2.innerText = `Sorry. No movies found with ${SEARCH_TERM}`;
    resultSection.insertAdjacentElement('afterbegin', h2);
  } else {
    h2.innerText = `Total matches for ${SEARCH_TERM}: ${data.totalResults}`;
    resultSection.insertAdjacentElement('afterbegin', h2);

    var searchResults = data.Search;
    searchResults.forEach((result, i) => {
      var movieCard = document.createElement('div');
      movieCard.setAttribute('class','movieCard');
      
      var movieTitle = document.createElement('h3');
      var moviePoster = document.createElement('img');
      var movieYear = document.createElement('p');

      movieTitle.innerText = `${i+1}.${result.Title}`;
      movieCard.insertAdjacentElement('afterbegin', movieTitle);
      movieYear.innerText = result.Year;
      movieCard.insertAdjacentElement('beforeend', movieYear);
      
      if(result.Poster != 'N/A'){
        moviePoster.setAttribute('src', result.Poster);
      } else {
        moviePoster.setAttribute('src', '../images/noposter.gif');
      }
      movieCard.insertAdjacentElement('beforeend', moviePoster);

      resultSection.insertAdjacentElement('beforeend', movieCard);
    });
  }
  HR.insertAdjacentElement('afterend', resultSection);
}

/*
 * Updates DOM on a failed search (fetch error)
 *
 */
function searchError(error){
  console.log(error);
}
