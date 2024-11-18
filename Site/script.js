document.addEventListener("DOMContentLoaded", () => {
  const moviesContainer = document.getElementById("filmes");
  const favoritesContainer = document.getElementById("favoritos");
  const accountId = "11225628";
  const authHeader =
    "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIxMGU1MTViNDJkM2Q4YjI1YmVkYTUwZjYzYjJlNTM3YiIsIm5iZiI6MTczMTg5Mjk0MC40ODY5MDk0LCJzdWIiOiI2MTVjY2RjMDBiYzUyOTAwODc4NWFkMjkiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.nefYYGDYHHHvjCTooBy6-lbyQP5P4DOuRHIsIUcm0Rw"; // Substitua pelo seu token de acesso

    function getRandomNumber(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    
    function setHighlightImage(src) {
      const imageElement = document.getElementById("highlight-image");
      if (imageElement) {
        imageElement.src = src;
      } else {
        console.error("Imagem não encontrada no DOM.");
      }
    }
    
    const randomNumber = getRandomNumber(1, 100);
    console.log("Número aleatório gerado:", randomNumber);
    
    if (randomNumber > 50) {
      setHighlightImage("https://www.themoviedb.org/t/p/w1280/fUwfsPWEEdnSt29jIwJ5eVtySX6.jpg");
    } else {
      setHighlightImage("https://www.themoviedb.org/t/p/w1280/fUwfsPWEEdnSt29jIwJ5eVtySX6.jpg");
    }
  
    async function fetchMovies() {
    const url = "https://api.themoviedb.org/3/movie/popular";
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: authHeader,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      displayMovies(data.results);
    } catch (error) {
      console.error("Erro ao buscar filmes:", error);
    }
  }

  async function fetchFavoriteMovies() {
    const url = `https://api.themoviedb.org/3/account/${accountId}/favorite/movies?language=en-US&page=1&sort_by=created_at.asc`;
    const options = {
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization: authHeader,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      displayFavoriteMovies(data.results);
      fetchFavoriteMovies();
    } catch (error) {
      console.error("Erro ao buscar filmes favoritos:", error);
    }
  }

  async function favoriteMovie(movieId, isFavorite) {
    const url = `https://api.themoviedb.org/3/account/${accountId}/favorite`;
    const options = {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/json",
        Authorization: authHeader,
      },
      body: JSON.stringify({
        media_type: "movie",
        media_id: movieId,
        favorite: isFavorite,
      }),
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      console.log("Resposta ao favoritar:", data);
      fetchFavoriteMovies();
    } catch (error) {
      console.error("Erro ao favoritar filme:", error);
    }
  }

  function displayMovies(movies) {
    moviesContainer.innerHTML = "";
    movies.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.className = "filme";

      const movieImg = document.createElement("img");
      movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieImg.alt = movie.title;

      const movieTitle = document.createElement("span");
      movieTitle.textContent = movie.title;

      const favoriteBtn = document.createElement("button");
      favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>'; 
      favoriteBtn.onclick = () => {
        if (favoriteBtn.classList.contains("active")) {
          favoriteMovie(movie.id, false); 
          favoriteBtn.classList.remove("active"); 
          removeFromFavorites(movie.id); 
        } else {
          favoriteMovie(movie.id, true); 
          favoriteBtn.classList.add("active"); 
          addToFavorites(movie); 
        }
      };

      movieDiv.appendChild(movieImg);
      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(favoriteBtn);
      moviesContainer.appendChild(movieDiv);
    });
  }

  function displayFavoriteMovies(favorites) {
    favoritesContainer.innerHTML = "";
    favorites.forEach((movie) => {
      const movieDiv = document.createElement("div");
      movieDiv.className = "filme";

      const movieImg = document.createElement("img");
      movieImg.src = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;
      movieImg.alt = movie.title;

      const movieTitle = document.createElement("span");
      movieTitle.textContent = movie.title;

      const removeBtn = document.createElement("button");
      removeBtn.innerHTML = '<i class="fas fa-heart"></i>'; 
      removeBtn.onclick = () => {
        favoriteMovie(movie.id, false); 
        removeFromFavorites(movie.id); 
        fetchFavoriteMovies(); 
      };

      movieDiv.appendChild(movieImg);
      movieDiv.appendChild(movieTitle);
      movieDiv.appendChild(removeBtn);
      favoritesContainer.appendChild(movieDiv);
    });
  }

  function addToFavorites(movie) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    if (!favorites.some((favMovie) => favMovie.id === movie.id)) {
      favorites.push(movie);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }

  function removeFromFavorites(movieId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));
  }

  function openFavoritesInNewTab() {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

    if (favorites.length === 0) {
      alert("Você ainda não tem filmes favoritos.");
      return;
    }

    let newTabContent = `
      <!DOCTYPE html>
      <html lang="pt-br">
      <head>
        <meta charset="UTF-8">
        <title>Filmes Favoritos</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #363636; margin: 0; padding: 20px; }
          h1 { text-align: center; }
          .movie-card { background-color: #4f4f4f; margin: 10px; padding: 15px; width: 200px; text-align: center; border-radius: 10px; box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1); display: inline-block; }
          .movie-card img { width: 100%; border-radius: 5px; }
           .movie-card p { 
            max-height: 300px; 
            overflow: hidden; 
            text-overflow: ellipsis; 
            display: -webkit-box; 
            -webkit-line-clamp: 5; 
            -webkit-box-orient: vertical; 
          }
          .back-btn { position: absolute; top: 20px; left: 20px; background-color: #f5f5f5; padding: 10px; border-radius: 5px; cursor: pointer; }
        </style>
        <script>
          async function favoriteMovie(movieId, isFavorite) {
            const url = \`https://api.themoviedb.org/3/account/${accountId}/favorite\`;
            const options = {
              method: "POST",
              headers: {
                accept: "application/json",
                "Content-Type": "application/json",
                Authorization: "${authHeader}",
              },
              body: JSON.stringify({
                media_type: "movie",
                media_id: movieId,
                favorite: isFavorite,
              }),
            };

            try {
              const response = await fetch(url, options);
              const data = await response.json();
              console.log("Resposta ao favoritar:", data);
              let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
              favorites = favorites.filter((movie) => movie.id !== movieId);
              localStorage.setItem("favorites", JSON.stringify(favorites));
              document.querySelector(\`[data-id="\${movieId}"]\`).remove();
            } catch (error) {
              console.error("Erro ao favoritar filme:", error);
            }
          }
        </script>
      </head>
      <body>
        <button class="back-btn" onclick="window.location.href = '/';">Voltar</button> <!-- Redireciona para a página principal -->
        <h1>Filmes Favoritos</h1>
        <div id="favorite-movies">
    `;

    favorites.forEach((movie) => {
      newTabContent += `
        <div class="movie-card" data-id="${movie.id}">
          <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}">
          <h3>${movie.title}</h3>
          <p>${movie.overview}</p>
          <button onclick="favoriteMovie(${movie.id}, false)">Remover</button>
        </div>
      `;
    });

    newTabContent += `</div></body></html>`;

    const newTab = window.open();
    newTab.document.write(newTabContent);
    newTab.document.close();
  }

  function removeFavorite(movieId) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    favorites = favorites.filter((movie) => movie.id !== movieId);
    localStorage.setItem("favorites", JSON.stringify(favorites));

    window.location.reload();
  }

  const openFavoritesButton = document.getElementById("open-favorites-button");
  if (openFavoritesButton) {
    openFavoritesButton.addEventListener("click", openFavoritesInNewTab);
  }

  fetchMovies();
  fetchFavoriteMovies();
});
