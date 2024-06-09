const apiKey = 'f3e6ffebe13a6082e65b15128d0d19f4';
const moviesGrid = document.getElementById('moviesGrid');
const tvShowsGrid = document.getElementById('tvShowsGrid');
const searchResultsGrid = document.getElementById('searchResultsGrid');
const pagination = document.getElementById('pagination');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');

let currentPage = 1;
let totalPages = 1;
let currentCategory = 'trending';
let currentType = 'movie';

document.getElementById('moviesTab').addEventListener('click', () => {
  switchTab('movies', 'movie');
});

document.getElementById('tvShowsTab').addEventListener('click', () => {
  switchTab('tvShows', 'tv');
});

document.getElementById('trendingTab').addEventListener('click', () => {
  switchCategory('trending');
});

document.getElementById('latestTab').addEventListener('click', () => {
  switchCategory('latest');
});

searchButton.addEventListener('click', () => {
  searchContent(searchInput.value);
});

const switchTab = (tab, type) => {
  currentType = type;
  document.getElementById('moviesTab').classList.toggle('active', type === 'movie');
  document.getElementById('tvShowsTab').classList.toggle('active', type === 'tv');
  document.getElementById('moviesTab').ariaPressed = (type === 'movie');
  document.getElementById('tvShowsTab').ariaPressed = (type === 'tv');
  moviesGrid.style.display = type === 'movie' ? 'grid' : 'none';
  tvShowsGrid.style.display = type === 'tv' ? 'grid' : 'none';
  searchResultsGrid.style.display = 'none';
  currentPage = 1; // Reset to page 1 when switching tabs
  fetchContent();
};

const switchCategory = (category) => {
  currentCategory = category;
  document.getElementById('trendingTab').classList.toggle('active', category === 'trending');
  document.getElementById('latestTab').classList.toggle('active', category === 'latest');
  document.getElementById('trendingTab').ariaSelected = (category === 'trending');
  document.getElementById('latestTab').ariaSelected = (category === 'latest');
  currentPage = 1; // Reset to page 1 when switching categories
  fetchContent();
};

const fetchContent = async () => {
  const grid = currentType === 'movie' ? moviesGrid : tvShowsGrid;
  grid.innerHTML = '';
  let url = `https://api.themoviedb.org/3/trending/${currentType}/day?api_key=${apiKey}&page=${currentPage}`;
  if (currentCategory === 'latest') {
    url = currentType === 'movie'
      ? `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&page=${currentPage}`
      : `https://api.themoviedb.org/3/tv/on_the_air?api_key=${apiKey}&page=${currentPage}`;
  }
  const response = await fetch(url);
  const data = await response.json();
  totalPages = data.total_pages;

  data.results.forEach(item => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener('click', () => showDetails(item.id, currentType));
    grid.appendChild(img);
  });
  updatePagination();
};

const updatePagination = () => {
  pagination.innerHTML = '';
  if (currentPage > 1) {
    const prevButton = document.createElement('button');
    prevButton.textContent = 'Prev';
    prevButton.addEventListener('click', () => {
      currentPage--;
      fetchContent();
    });
    pagination.appendChild(prevButton);
  }
  if (currentPage < totalPages) {
    const nextButton = document.createElement('button');
    nextButton.textContent = 'Next';
    nextButton.addEventListener('click', () => {
      currentPage++;
      fetchContent();
    });
    pagination.appendChild(nextButton);
  }
};

const showDetails = (id, type) => {
  window.location.href = `details.html?id=${id}&type=${type}`;
};

const searchContent = async (query) => {
  if (!query) return;
  moviesGrid.style.display = 'none';
  tvShowsGrid.style.display = 'none';
  searchResultsGrid.style.display = 'grid';
  searchResultsGrid.innerHTML = '';
  const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}`;
  const response = await fetch(url);
  const data = await response.json();
  data.results.forEach(item => {
    const img = document.createElement('img');
    img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
    img.alt = item.title || item.name;
    img.addEventListener('click', () => showDetails(item.id, item.media_type));
    searchResultsGrid.appendChild(img);
  });
};

document.getElementById('watchlistTab').addEventListener('click', () => {
  window.location.href = 'watchlist.html';
});

fetchContent();
