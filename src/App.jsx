import { useEffect, useState } from "react";
import TextExpander from "./TextExpander";
import "./style.css";
import StarRating from "./StarRating";

const apiKey = "a6c1a1f6";
const url = `http://www.omdbapi.com/?apikey=${apiKey}&`;
const tempMovieData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
  },
  {
    imdbID: "tt0133093",
    Title: "The Matrix",
    Year: "1999",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BNzQzOTk3OTAtNDQ0Zi00ZTVkLWI0MTEtMDllZjNkYzNjNTc4L2ltYWdlXkEyXkFqcGdeQXVyNjU0OTQ0OTY@._V1_SX300.jpg",
  },
  {
    imdbID: "tt6751668",
    Title: "Parasite",
    Year: "2019",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BYWZjMjk3ZTItODQ2ZC00NTY5LWE0ZDYtZTI3MjcwN2Q5NTVkXkEyXkFqcGdeQXVyODk4OTc3MTY@._V1_SX300.jpg",
  },
];

const tempWatchedData = [
  {
    imdbID: "tt1375666",
    Title: "Inception",
    Year: "2010",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BMjAxMzY3NjcxNF5BMl5BanBnXkFtZTcwNTI5OTM0Mw@@._V1_SX300.jpg",
    runtime: 148,
    imdbRating: 8.8,
    userRating: 10,
  },
  {
    imdbID: "tt0088763",
    Title: "Back to the Future",
    Year: "1985",
    Poster:
      "https://m.media-amazon.com/images/M/MV5BZmU0M2Y1OGUtZjIxNi00ZjBkLTg1MjgtOWIyNThiZWIwYjRiXkEyXkFqcGdeQXVyMTQxNzMzNDI@._V1_SX300.jpg",
    runtime: 116,
    imdbRating: 8.5,
    userRating: 9,
  },
];

const average = (arr) =>
  arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

function ErrorMessage({ children }) {
  return <p>{children}</p>;
}
function Loader() {
  return <p>loading...⏳</p>;
}
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useState([]);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  function handleSelect(id) {
    setSelectedMovieId((prevMovieId) => (id === prevMovieId ? null : id));
    // setSelectedMovieId(id);
  }
  function handleAddToWatchedList(movie) {
    setWatched((prevMovies) => [...prevMovies, movie]);
  }
  function handleUnselect() {
    setSelectedMovieId(null);
  }
  function handleQueryChange(e) {
    setQuery(e.target.value);
  }
  //try eventlistener after keyup 2sec
  useEffect(
    function () {
      const controller = new AbortController();
      async function search() {
        setIsLoading(true);
        setError(null);
        try {
          const response = await fetch(`${url}s=${query}`, {
            signal: controller.signal,
          });
          if (!response.ok) throw new Error("cant fetch data.📛📛");
          const { Search: search } = await response.json();
          console.log("search :>> ", search);
          if (!search) throw new Error("no movies with this name.🍿⛔");
          setMovies(search);
        } catch (error) {
          console.log("error :>> ", error);
          if (error.name === "AbortError") return setError(null);
          setError(error.message);
          setMovies([]);
        } finally {
          setIsLoading(false);
        }
      }
      if (!query || query.length < 2) return;
      search();
      return function () {
        console.log("cleanup");
        controller.abort();
      };
    },
    [query]
  );
  return (
    <>
      <Nav>
        <Search onQueryChange={handleQueryChange} query={query} />
        <NumberOfResults movies={movies} />
      </Nav>
      <Main>
        <Box>
          <MoviesList
            onSelect={handleSelect}
            movies={movies}
            isLoading={isLoading}
            error={error}
          />
        </Box>
        <Box>
          <Summary watched={watched} />
          <WatchedMoviesList
            watched={watched}
            selectedMovieId={selectedMovieId}
            onUnselect={handleUnselect}
            onWatch={handleAddToWatchedList}
          />
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function WatchedMoviesList({ watched, selectedMovieId, onUnselect, onWatch }) {
  console.log("selectedMovieId :>> ", selectedMovieId);
  return (
    <>
      {selectedMovieId ? (
        <SelectedMovie
          selectedMovieId={selectedMovieId}
          onUnselect={onUnselect}
          onWatch={onWatch}
          watched={watched}
        />
      ) : (
        <ul className="list list-watched">
          {watched.map((movie) => (
            <WatchedMovie key={movie.imdbID} movie={movie} />
          ))}
        </ul>
      )}
    </>
  );
}
function SelectedMovie({ selectedMovieId, onUnselect, onWatch, watched }) {
  const [movie, setMovie] = useState(null);
  const [rating, setRating] = useState(0);
  console.log("onUnselect :>> ", onUnselect);
  function handleSetRating(rating) {
    setRating(rating);
  }
  useEffect(() => {
    async function search() {
      const response = await fetch(`${url}i=${selectedMovieId}`);
      if (!response.ok) throw new Error("cant get movie details📛📛");
      const data = await response.json();
      console.log("data :>> ", data);
      setMovie(data);
    }
    search();
  }, [selectedMovieId]);
  if (!movie) return;
  console.log("movie.runtime :>> ", Number(movie.Runtime.split(" ")[0]));
  const isWatched = watched.some(
    (watchedMovie) => watchedMovie.imdbID === movie.imdbID
  );
  // const {
  //   Actors: actors,
  //   Awards: awards,
  //   BoxOffice: boxOffice,
  //   Country: country,
  //   DVD: dvd,
  //   Director: director,
  //   Genre: genre,
  //   Language: language,
  //   Metascore: metascore,
  //   Plot: plot,
  //   Poster: poster,
  //   Production: production,
  //   Rated: rated,
  //   Ratings: [internetMovieDatabase, rottenTomatoes, metacritic],
  //   Released: released,
  //   Response: response,
  //   Runtime: runtime,
  //   Title: title,
  //   Type: type,
  //   Website: website,
  //   Writer: writer,
  //   Year: year,
  //   imdbID,
  //   imdbRating,
  //   imdbVotes,
  // } = movie;

  return (
    <>
      <button onClick={onUnselect}>&larr;</button>
      <p>{movie.Title}</p>
      {!isWatched && (
        <button onClick={() => onWatch(movie)}>add to list</button>
      )}
      {isWatched && <StarRating maxRating={10} size={24} />}
    </>
  );
}
function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => Number(movie.Runtime.split(" ")[0]))
  );

  return (
    <div className="summary">
      <h2>Movies you watched</h2>
      <div>
        <p>
          <span>#️⃣</span>
          <span>{watched.length} movies</span>
        </p>
        <p>
          <span>⭐️</span>
          <span>{avgImdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime} min</span>
        </p>
      </div>
    </div>
  );
}
function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}
function MoviesList({ movies, isLoading, error, onSelect }) {
  return (
    <ul className="list list-movies">
      {isLoading ? (
        <Loader />
      ) : (
        movies?.map((movie) => (
          <Movie onSelect={onSelect} key={movie.imdbID} movie={movie} />
        ))
      )}
      {error && <ErrorMessage>{error}</ErrorMessage>}
    </ul>
  );
}
function Movie({ movie, onSelect }) {
  return (
    <li key={movie.imdbID} onClick={() => onSelect(movie.imdbID)}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>🗓</span>
          <span>{movie.Year}</span>
        </p>
      </div>
    </li>
  );
}
function WatchedMovie({ movie }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.Poster} alt={`${movie.Title} poster`} />
      <h3>{movie.Title}</h3>
      <div>
        <p>
          <span>⭐️</span>
          <span>{movie.imdbRating}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{movie.userRating}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{movie.runtime} min</span>
        </p>
      </div>
    </li>
  );
}
function Nav({ children }) {
  return (
    <nav className="nav-bar">
      <Logo />
      {children}
    </nav>
  );
}
function Search({ query, onQueryChange }) {
  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={onQueryChange}
    />
  );
}
function Logo() {
  return (
    <div className="logo">
      <span role="img">🍿</span>
      <h1>usePopcorn</h1>
    </div>
  );
}
function NumberOfResults({ movies }) {
  return (
    <p className="num-results">
      Found <strong>{movies.length}</strong> results
    </p>
  );
}
