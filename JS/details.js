const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get("id");
const type = urlParams.get("type");
const apiKey = "f3e6ffebe13a6082e65b15128d0d19f4";

const fetchDetails = async () => {
  const response = await fetch(`https://api.themoviedb.org/3/${type}/${id}?api_key=${apiKey}`);
  const data = await response.json();
  document.getElementById("poster").src = `https://image.tmdb.org/t/p/w500${data.poster_path}`;
  document.getElementById("title").textContent = data.title || data.name;
  document.getElementById("overview").textContent = data.overview;
  document.getElementById("rating").textContent = data.vote_average;
  document.getElementById("genre").textContent = data.genres.map((genre) => genre.name).join(", ");

  const creditsResponse = await fetch(`https://api.themoviedb.org/3/${type}/${id}/credits?api_key=${apiKey}`);
  const creditsData = await creditsResponse.json();
  document.getElementById("cast").textContent = creditsData.cast.slice(0, 5).map((member) => member.name).join(", ");

  document.getElementById("watchButton").addEventListener("click", () => {
    window.location.href = `watch.html?id=${id}&type=${type}`;
  });

  document.getElementById("watchlistButton").addEventListener("click", () => {
    addToWatchlist(data, type);
  });

  document.getElementById('watchlistTab').addEventListener('click', () => {
    window.location.href = 'watchlist.html';
  });
};

const addToWatchlist = (item, type) => {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const isAlreadyInWatchlist = watchlist.some(watchlistItem => watchlistItem.id === item.id);

  if (isAlreadyInWatchlist) {
    alert("Already in Watchlist");
  } else {
    watchlist.push({ 
      id: item.id, 
      title: item.title || item.name, 
      poster_path: item.poster_path, 
      media_type: type
    });
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    alert("Added to Watchlist");
  }
};

fetchDetails();
