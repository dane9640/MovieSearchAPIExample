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
  const API_KEY = '58017d81';
  const URL_FRONT = `http://www.omdbapi.com/?apikey=${API_KEY}&type=movie&`;
  const SEARCH_BUTTON = document.querySelector('input[type="submit"]');
  
  var searchTerm = '';
  var page = 1;
  
  SEARCH_BUTTON.addEventListener('click', (e) => {
    e.preventDefault();
    page = 1;
    searchTerm = `s=${document.querySelector('#search').value}`;

    createRequest(`${URL_FRONT}${searchTerm}&page=${page}`, searchSuccess, searchError, e);
    if(document.body.offsetHeight - 200 < window.innerHeight + scrollY){
      page++;
      createRequest(`${URL_FRONT}${searchTerm}&page=${page}`, searchSuccess, searchError, 'scroll');
    }
  });

  window.addEventListener('scroll', (e) => {
    if(window.innerHeight + window.scrollY > document.body.offsetHeight - 200){
      page++;
      createRequest(`${URL_FRONT}${searchTerm}&page=${page}`, searchSuccess, searchError, e);
    }
  });
}

/**
 * Creates the Fetch Object
 * 
 * 
 * @param {String} url - Endpoint URL for fetch request
 * @param {Function} succeed - The function for the succeed promise
 * @param {Function} fail - The function for the fail catch
 * @param {Event} sourceEvent - The event that triggered call
 */
function createRequest(url, succeed, fail, sourceEvent){
  fetch(url)
    .then((response) => handleErrors(response))
    .then((data) => succeed(data, sourceEvent))
    .catch((error) => fail(error));
}

/**
 * Handles fetch errors
 *
 * @param {Response} response - Response from fetch request
 *
 */
function handleErrors(response){
  
  if(!response.ok){
    throw(`${response.status}: ${response.statusText}`);
  }
  return response.json();
}

/**
 * Updates DOM on a successful search, including 'no movies found'

 *
 * @param {Parsed JSON} data - Parsed JSON from the handle errors response
 * @param {Event} sourceEvent - Event that triggered initial call to fetch
 */
function searchSuccess(data, sourceEvent){
  const SEARCH_TERM = document.querySelector('#search').value
  const HR = document.querySelector('hr');

  document.title = `${SEARCH_TERM} | Results`;

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
    var resultSection = document.createElement('ol');
    resultSection.setAttribute('id', 'resultSection');
    h2.insertAdjacentElement('afterend', resultSection);
  }
  
  if (data.totalResults){
    var searchResults = data.Search;
    searchResults.forEach((result, i) => {
      var movieCard = document.createElement('li');
      movieCard.setAttribute('class','movieCard');
      
      var movieInfo = document.createElement('div');
      movieInfo.setAttribute('class', 'movieInfo');
      var movieTitle = document.createElement('h3');
      var moviePoster = document.createElement('img');
      moviePoster.setAttribute('alt', `${movieTitle} Poster`);
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

/**
 * Updates DOM on a failed search (fetch error)
 *
 * @param {String} error - Error message caught from the error handling
 */
function searchError(error){
  console.log(error);
}
