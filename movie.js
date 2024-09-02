// TMDB APIs

const API_KEY = 'api_key=a9f9fd4995ee392c2f9ac09565316350';
const BASE_URL = 'https://api.themoviedb.org/3';
const POP_MOVIES = BASE_URL + '/discover/movie?sort_by=popularity.desc&' + API_KEY;
const IMG_URL = 'https://image.tmdb.org/t/p/w500';

const movies_section = document.getElementsByClassName('movies-section')[0];

const prev = document.getElementById('prev')
const next = document.getElementById('next')
const current = document.getElementById('current')

var currentPage = 1;
var nextPage = 2;
var prevPage = 0;
var lastUrl = '';
var totalPages = 500;

getMovies(POP_MOVIES);

function getMovies (url) {
    lastUrl = url;
    fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log(data.results);
            showMovies(data.results);
            currentPage = data.page;
            nextPage = currentPage + 1;
            prevPage = currentPage - 1;
            totalPages = data.total_pages;

            current.innerText = currentPage;

            if(currentPage <= 1){
              prev.classList.add('disabled');
              next.classList.remove('disabled')
            }else if(currentPage>= totalPages){
              prev.classList.remove('disabled');
              next.classList.add('disabled')
            }else{
              prev.classList.remove('disabled');
              next.classList.remove('disabled')
            }
            window.scrollTo({top: 0,behavior: 'smooth'});
        }
    );
}

function showMovies (movies) {

    movies_section.innerHTML = '';

    movies.forEach(movie => {
        const {title , poster_path , vote_average , overview} = movie;
        const movieel = document.createElement('div');
        movieel.classList.add('movie-card');
        movieel.dataset.movieId = movie.id;
        movieel.innerHTML=`
        <div class="movie-img">
            <img class="movie-pic" src="${IMG_URL + poster_path}" alt="${title}">
        </div>
        <div class="info">
            <div class="movie-title">${title}</div>
            </br>
            <div class="movie-info">${overview.substring(0,100) + '.....'}</div>
            </br>
            <div class="mainline">
                <div class="rating">
                    ${vote_average}
                    <i class="fa fa-star star"></i>
                </div>
                <button class="glow-on-hover" type="button">Details</button>
            </div>
        </div>
        `
        movieel.addEventListener('click', () => {
            // Retrieve the movie ID from data-movie-id attribute
            const movieId = movieel.dataset.movieId;
    
            // Redirect to movie.html page with the movie ID as a query parameter
            window.location.href = `movie_details.html?id=${movieId}`;
            
          });

        // movies_section.addEventListener("click", function(e) {
            
        //     var target = e.target;
          
            
        //     if (target.matches(".glow-on-hover")) {
              
        //       var movieId = movieel.dataset.movieId;
          
              
        //       window.location.href = `movie_details.html?id=${movieId}`;
        //     }
        //   });
        //   console.log("yay");

        movies_section.appendChild(movieel);
    });
    gsap.from(".movie-card",{duration: 3, opacity: 0})
}

prev.addEventListener('click', () => {
    if(prevPage > 0){
      pageCall(prevPage);
    }
  })
  
  next.addEventListener('click', () => {
    if(nextPage <= totalPages){
      pageCall(nextPage);
    }
  })
  
  function pageCall(page){
    let urlSplit = lastUrl.split('?');
    let queryParams = urlSplit[1].split('&');
    let key = queryParams[queryParams.length -1].split('=');
    if(key[0] != 'page'){
      let url = lastUrl + '&page='+page
      getMovies(url);
    }else{
      key[1] = page.toString();
      let a = key.join('=');
      queryParams[queryParams.length -1] = a;
      let b = queryParams.join('&');
      let url = urlSplit[0] +'?'+ b
      getMovies(url);
    }
  }

  function fetchSearchResults(query) {
    const encodedQuery = encodeURIComponent(query);
    const url = `https://api.themoviedb.org/3/search/movie?${API_KEY}&query=${encodedQuery}`;
    
    return fetch(url)
      .then(response => response.json())
      .then(data => data.results)
      .catch(error => {
        console.error('Error:', error);
        return [];
      });
  }

  function displaySearchResults(results) {
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.innerHTML = '';
  
    if (results.length === 0) {
      searchResultsContainer.innerHTML = '<p>No results found</p>';
      return;
    }

    const resultContainer = document.createElement('div');
    resultContainer.classList.add('result-container');
    searchResultsContainer.appendChild(resultContainer);
  
    results.forEach(result => {
      // const listItem = document.createElement('li');
      // listItem.textContent = result.title;
      const resultItem = document.createElement('div');
      resultItem.classList.add('result-item');
      resultContainer.appendChild(resultItem);

      const imageElement = document.createElement('img');
      imageElement.src = `https://image.tmdb.org/t/p/w200/${result.poster_path}`;
      imageElement.alt = result.title;
      resultItem.appendChild(imageElement);

      const movieDetails = document.createElement('div');
      movieDetails.classList.add('movie-details');
      resultItem.appendChild(movieDetails);

      const movieTitle = document.createElement('h3');
      movieTitle.textContent = result.title;
      movieDetails.appendChild(movieTitle);

      const movieRating = document.createElement('p');
      movieRating.textContent = `Rating: ${result.vote_average}`;
      movieDetails.appendChild(movieRating);
      resultItem.addEventListener('click', () => {
        // Handle item selection (e.g., redirect to movie details page)
        const movieId = result.id;
        window.location.href = `movie_details.html?id=${movieId}`;
        console.log('Selected movie ID:', result.id);
      });
      resultContainer.appendChild(resultItem);
    });
  }
  
  // Function to handle search input
  function handleSearchInput() {
    const searchInput = document.getElementById('search-input');
    const query = searchInput.value.trim();
    const searchResultsContainer = document.getElementById('search-results');
    searchResultsContainer.style.display = 'none';
  
    if (query === '') {
      searchResultsContainer.innerHTML = '';
      searchResultsContainer.style.display = 'none';
      return;
    }

    searchResultsContainer.style.display = 'block';
  
    fetchSearchResults(query)
      .then(results => {
        displaySearchResults(results);
      });
  }
  
  // Event listener for search input
  const searchInput = document.getElementById('search-input');
  searchInput.addEventListener('input', handleSearchInput);