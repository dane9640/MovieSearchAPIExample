/*
Git Repo: https://github.com/dane9640/Project14-web215

Project API: omdbapi.com
http://www.omdbapi.com/?apikey=[yourkey]&

Extra API KEYS:
---------------
e0436bdd
*/
const API_KEY = 'd00f2a4c';

submitSearchTerm();

/*
* Builds URL string from user's search term/phrase
*
*/
function submitSearchTerm(){
  const URL_FRONT = `https://www.omdbapi.com/?apikey=${API_KEY}&type=movie&s=`;
  const SEARCH_BUTTON = document.querySelector('input[type="submit"]');
  
  var searchBar = document.querySelector('#search');
  var searchTerm = '';
  var page = 1;
  
  if(localStorage.searchTerm){
    searchBar.value = localStorage.searchTerm;
    searchTerm = searchBar.value;
    
    createRequest(`${URL_FRONT}${localStorage.searchTerm}&page=${page}`, searchSuccess, searchError, new Event('click'));
    if(document.body.offsetHeight - 200 < window.innerHeight + scrollY){
      page++;
      createRequest(`${URL_FRONT}${localStorage.searchTerm}&page=${page}`, searchSuccess, searchError, 'scroll');
    }
  }
   
  SEARCH_BUTTON.addEventListener('click', (e) => {
    e.preventDefault();
    page = 1;
    searchTerm = `${document.querySelector('#search').value}`;

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

  var remember = true;

  document.title = `${SEARCH_TERM} | Results`;

  if(!document.querySelector('h2')){
    var h2 = document.createElement('h2');
    HR.insertAdjacentElement('afterend', h2);
  } else {
    var h2 = document.querySelector('h2');
  }

  if (document.querySelector('#remember')){
    var remember = document.querySelector('#remember');
    remember.innerText = 'Don\'t remember this search';
  } else {
    var remember = document.createElement('span');
    remember.id = 'remember';
    remember.innerText = 'Don\'t remember this search'
  }
  
  if(sourceEvent.type == 'click'){
    if(data.totalResults == undefined) {
      h2.innerText = `Sorry. No movies found with ${SEARCH_TERM}`;
      localStorage.clear();
      if (remember){
        remember.remove();
      }
    } else{
      h2.innerText = `Total matches for ${SEARCH_TERM}: ${data.totalResults}`;
      h2.insertAdjacentElement('afterend', remember);
      localStorage.setItem('searchTerm', SEARCH_TERM);
    }
  }

  remember.addEventListener('click', (e) => {
    if(remember){
      localStorage.clear();
      e.currentTarget.innerText = 'Search won\'t be remembered'
      e.currentTarget.style.textDecoration = 'none';
    } else {
      e.currentTarget.innerText = 'Don\'t remember this search';
      e.currentTarget.style.textDecoration = '';
      localStorage.setItem('searchTerm', document.querySelector('#search').value);
    }
    remember = !remember;
  });

  if(document.querySelector('#resultSection')){
    var resultSection = document.querySelector('#resultSection');
    if(sourceEvent.type == 'click'){
      resultSection.innerHTML = '';
    }
  } else {
    var resultSection = document.createElement('ol');
    resultSection.setAttribute('id', 'resultSection');
    remember.insertAdjacentElement('afterend', resultSection);
  }
  
  if (data.totalResults){
    var searchResults = data.Search;

    searchResults.forEach((result, i) => {
      var movieCard = document.createElement('li');
      movieCard.setAttribute('class','movieCard');
      movieCard.dataset.movieTitle = result.Title;
      movieCard.dataset.id = result.imdbID;
      movieCard.addEventListener('click', (e) => getDetails(e));
      
      var movieInfo = document.createElement('div');
      movieInfo.setAttribute('class', 'movieInfo');
      var movieTitle = document.createElement('h3');
      var posterContainer = document.createElement('div');
      posterContainer.setAttribute('class', 'posterContainer');
      var moviePoster = document.createElement('img');
      var movieYear = document.createElement('p');
      
      movieTitle.innerHTML = `${result.Title}`;
      movieYear.innerHTML = `<time datetime="${result.Year}">${result.Year}</time>`;
      movieInfo.insertAdjacentElement('beforeend', movieTitle);
      movieInfo.insertAdjacentElement('beforeend', movieYear);
      movieInfo.innerHTML += `<a href='#'>Details >>></a>`
      movieCard.insertAdjacentElement('beforeend', movieInfo);
      
      if(result.Poster != 'N/A'){
        console.log(data, moviePoster)
        moviePoster.setAttribute('src', result.Poster);
        moviePoster.setAttribute('alt', `${movieTitle.innerText} Poster`);
      } else {
        moviePoster.setAttribute('src', 'images/noposter.gif');
        moviePoster.setAttribute('alt', `No Poster Found`);
      }

      posterContainer.insertAdjacentElement('beforeend', moviePoster);
      movieCard.insertAdjacentElement('beforeend', posterContainer);

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

/**
 * Builds an endpoint for searching specific movie
 *
 * @param {Event} event the event that triggered the function
 */
function getDetails(event){
  const DETAILS_ENDPOINT_BEGIN = `https://www.omdbapi.com/?apiKey=${API_KEY}`;
  const EVENT_CARD = event.currentTarget;
  
  var id = EVENT_CARD.dataset.id;
  createRequest(`${DETAILS_ENDPOINT_BEGIN}&i=${id}&plot=full`, buildModal, searchError, event);
}

/**
 * builds the modal detail box for the specific movie if a response is found
 *
 * @param {Parsed JSON} data Parsed JSON from request
 * @param {Event} event event that trigged function
 */
function buildModal(data, event) {
  var modalContainer = document.querySelector('.modalContainer');

  if(document.querySelector('.modalContent')) {
    var modalContent = document.querySelector('.modalContent');
    modalContent.innerHTML = '';
  } else {
    var modalContent = document.createElement('section');
    modalContent.setAttribute('class', 'modalContent');
  }

  var title = data.Title;
  var year = data.Year;
  var plot = data.Plot;
  var moviePoster = document.createElement('img');
  
  if(data.Poster != 'N/A'){
    moviePoster.setAttribute('src', data.Poster);
    moviePoster.setAttribute('alt', `${title} Poster`);
  } else {
    moviePoster.setAttribute('src', ' images/noposter.gif');
    moviePoster.setAttribute('alt', `No Poster Found`);
  }

  modalContent.innerHTML = `<h2>${title}</h2>
                            <span class="close">&times;</span>
                            <p><time datetime="${year}">${year}</p>
                            <p>${plot}</p>`;
  modalContent.insertAdjacentElement('beforeend', moviePoster);
  
  modalContainer.insertAdjacentElement('beforeend', modalContent);
  toggleDisplay(modalContainer, 'flex');
  
  modalContainer.addEventListener('click', (e) => {
    if (e.target == e.currentTarget || e.target == document.querySelector('.close')){
      toggleDisplay(e.currentTarget);
    }
  });
}

/**
 * Sets display of element to setting and none if left empty
 *
 * @param {HTML Element} element element you want to set the display on.
 * @param {String} setting setting you want to set dispaly to eg. flex grid block etc.
 */
function toggleDisplay(element, setting){
  if(setting == undefined){
    element.style.display = 'none';
  } else {
    element.style.display = setting;
  }
}
