document.addEventListener('DOMContentLoaded', () => {
  const watchlistGrid = document.getElementById('watchlistGrid');
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];

  if (watchlist.length === 0) {
    watchlistGrid.textContent = 'Your watchlist is empty.';
  } else {
    watchlist.forEach(item => {
      const itemElement = document.createElement('div');
      itemElement.classList.add('watchlist-item');

      const img = document.createElement('img');
      img.src = `https://image.tmdb.org/t/p/w500${item.poster_path}`;
      img.alt = item.title || item.name;
      img.addEventListener('click', () => {
        window.location.href = `details.html?id=${item.id}&type=${item.media_type}`;
      });

      const title = document.createElement('h3');
      title.textContent = item.title || item.name;

      const removeButton = document.createElement('button');
      removeButton.textContent = 'Remove';
      removeButton.addEventListener('click', () => {
        removeFromWatchlist(item.id);
        watchlistGrid.removeChild(itemElement);
      });

      itemElement.appendChild(img);
      itemElement.appendChild(title);
      itemElement.appendChild(removeButton);
      watchlistGrid.appendChild(itemElement);
    });
  }
});

const removeFromWatchlist = (id) => {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  const updatedWatchlist = watchlist.filter(item => item.id !== id);
  localStorage.setItem('watchlist', JSON.stringify(updatedWatchlist));
};
