/*
Project API:
omdbapi.com
http://www.omdbapi.com/?apikey=[yourkey]&



Lazy Loading tutorial for API calls:
https://medium.com/@kennethscoggins/how-to-use-the-infinite-scrolling-method-in-javascript-to-manage-large-api-result-sets-b8f78dba66fb
*/

submitSearchTerm();

/*
 * Builds URL string from user's search term/phrase
 *
 */
function submitSearchTerm(){
  
  const SEARCH_BUTTON = document.querySelector('input[type="submit"]');
  const API_KEY = 'f3786fc1';
  const URL = `http://www.omdbapi.com/?apikey=${API_KEY}&`;


  var page = 1;
  var searchTerm = '';

  SEARCH_BUTTON.addEventListener('click', (e) => {
    e.preventDefault();
    page = 1;
    
    searchTerm = `s=${document.querySelector('#search').value}`;

    createRequest(`${URL}${searchTerm}&page=${page}`, searchSuccess, searchError, e);
  });

  window.addEventListener('scroll', (e) => {
    if(window.innerHeight + window.scrollY > document.body.offsetHeight - 200){
      page++;
      createRequest(`${URL}${searchTerm}&page=${page}`, searchSuccess, searchError, e);
    }
  });
}

/*
 * Creates fetch request
 *
 */
function createRequest(url, succeed, fail, sourceEvent){
  fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data, sourceEvent))
    .catch((error) => fail(error));
}

/*
 * Handles fetch errors
 *
 */
function handleErrors(response){
  
  if(!response.ok){
    throw(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/*
 * Updates DOM on a successful search, including 'no movies found'
 *
 */
function searchSuccess(data, sourceEvent){
  const SEARCH_TERM = document.querySelector('#search').value
  const HR = document.querySelector('hr');

  if(!document.querySelector('h2')){
    var h2 = document.createElement('h2');
    HR.insertAdjacentElement('afterend', h2);
  } else {
    var h2 = document.querySelector('h2');
  }

  if(!data.totalResults && sourceEvent.type == 'click'){
    h2.innerText = `Sorry. No movies found with ${SEARCH_TERM}`;
  } else if(sourceEvent.type != 'scroll'){
    h2.innerText = `Total matches for ${SEARCH_TERM}: ${data.totalResults}`;
  }

  if(document.querySelector('#resultSection')){
    var resultSection = document.querySelector('#resultSection');
    if(sourceEvent.type == 'click'){
      resultSection.innerHTML = '';
    }
  } else {
    var resultSection = document.createElement('section');
    resultSection.setAttribute('id', 'resultSection');
    h2.insertAdjacentElement('afterend', resultSection);
    
  }
  
  if (data.totalResults){
    var searchResults = data.Search;
    searchResults.forEach((result, i) => {
      var movieCard = document.createElement('div');
      movieCard.setAttribute('class','movieCard');
      
      var movieInfo = document.createElement('div');
      movieInfo.setAttribute('id', 'movieInfo');
      var movieTitle = document.createElement('h3');
      var moviePoster = document.createElement('img');
      var movieYear = document.createElement('p');

      movieTitle.innerText = `${result.Title}`;
      movieYear.innerText = result.Year;
      movieInfo.insertAdjacentElement('beforeend', movieTitle);
      movieInfo.insertAdjacentElement('beforeend', movieYear);
      movieCard.insertAdjacentElement('beforeend', movieInfo);
      
      if(result.Poster != 'N/A'){
        moviePoster.setAttribute('src', result.Poster);
      } else {
        moviePoster.setAttribute('src', '../images/noposter.gif');
      }
      movieCard.insertAdjacentElement('beforeend', moviePoster);

      resultSection.insertAdjacentElement('beforeend', movieCard);
    });
  }
}

/*
 * Updates DOM on a failed search (fetch error)
 *
 */
function searchError(error){
  console.log(error);
}
