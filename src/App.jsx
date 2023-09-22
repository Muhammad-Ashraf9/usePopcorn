import { useEffect, useState } from "react";
import TextExpander from "./TextExpander";
import "./style.css";
import StarRating from "./StarRating";

const apiKey = "a6c1a1f6";
const url = `http://www.omdbapi.com/?apikey=${apiKey}&`;
//refactor to keep avg on adding movies with no runtime N/A
const average = (arr) =>
  arr.reduce(
    (acc, cur, i, arr) => (isNaN(cur) ? acc + acc / i : acc + cur / arr.length),
    0
  );
function ErrorMessage({ message }) {
  return (
    <p className="error">
      <span>⛔️</span> {message}
    </p>
  );
}
function Loader() {
  return <p className="loader">loading...⏳</p>;
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
    handleUnselect();
  }
  function handleUnselect() {
    setSelectedMovieId(null);
  }
  function handleQueryChange(e) {
    setQuery(e.target.value);
  }
  function handleRemoveFromWatchList(movieId) {
    setWatched((prevWatchedList) =>
      prevWatchedList.filter((movie) => movie.imdbID !== movieId)
    );
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
          if (!response.ok) throw new Error("cant fetch data.");
          const { Search: search } = await response.json();
          if (!search) throw new Error("no movies with this name.");
          setMovies(search);
        } catch (error) {
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
          {!selectedMovieId && <Summary watched={watched} />}
          <WatchedMoviesList
            watched={watched}
            selectedMovieId={selectedMovieId}
            onUnselect={handleUnselect}
            onWatch={handleAddToWatchedList}
            onRemove={handleRemoveFromWatchList}
          />
        </Box>
      </Main>
    </>
  );
}
function Main({ children }) {
  return <main className="main">{children}</main>;
}
function WatchedMoviesList({
  watched,
  selectedMovieId,
  onUnselect,
  onWatch,
  onRemove,
}) {
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
            <WatchedMovie
              key={movie.imdbID}
              movie={movie}
              onRemove={onRemove}
            />
          ))}
        </ul>
      )}
    </>
  );
}
function SelectedMovie({ selectedMovieId, onUnselect, onWatch, watched }) {
  const [movie, setMovie] = useState({});
  const [rating, setRating] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const {
    Actors: actors,
    Director: director,
    Genre: genre,
    Plot: plot,
    Poster: poster,
    Released: released,
    Runtime: runtime,
    Title: title,
    imdbID,
    imdbRating,
  } = movie;
  const watchedMovie = watched.find(
    (watchedMovie) => watchedMovie.imdbID === imdbID
  );
  const watchedUserRating = watchedMovie?.userRating;

  function handleSetRating(rating) {
    setRating(rating);
  }
  function handleAddToList() {
    const newMovie = {
      poster,
      runtime,
      title,
      imdbID,
      imdbRating,
      userRating: rating,
    };
    onWatch(newMovie);
  }
  useEffect(
    function () {
      async function search() {
        setIsLoading(true);
        const response = await fetch(`${url}i=${selectedMovieId}`);
        if (!response.ok) throw new Error("cant get movie details📛📛");
        const data = await response.json();
        setMovie(data);
        setIsLoading(false);
      }
      search();
    },
    [selectedMovieId]
  );
  useEffect(() => {
    if (movie) document.title = `Movie | ${movie.Title}`;
    return () => {
      document.title = "usePopcorn";
    };
  }, [movie]);

  return (
    <>
      <div className="details">
        {isLoading ? (
          <Loader />
        ) : (
          <>
            <header>
              <button className="btn-back" onClick={onUnselect}>
                &larr;
              </button>
              <img src={poster} alt={`Poster of ${movie} movie`} />
              <div className="details-overview">
                <h2>{title}</h2>
                <p>
                  {released} &bull; {runtime}
                </p>
                <p>{genre}</p>
                <p>
                  <span>⭐️</span>
                  {imdbRating} IMDb rating
                </p>
              </div>
            </header>
            <section>
              <div className="rating">
                {!watchedMovie ? (
                  <>
                    <StarRating
                      maxRating={10}
                      size={24}
                      onSetRating={handleSetRating}
                    />
                    {rating > 0 && (
                      <button className="btn-add" onClick={handleAddToList}>
                        + Add to list
                      </button>
                    )}
                  </>
                ) : (
                  <p>
                    You rated with movie {watchedUserRating} <span>⭐️</span>
                  </p>
                )}
              </div>
              <p>
                <em>{plot}</em>
              </p>
              <p>Starring {actors}</p>
              <p>Directed by {director}</p>
            </section>
          </>
        )}
      </div>
    </>
  );
}
function Summary({ watched }) {
  const avgImdbRating = average(watched.map((movie) => movie.imdbRating));
  const avgUserRating = average(watched.map((movie) => movie.userRating));
  const avgRuntime = average(
    watched.map((movie) => Number(movie.runtime.split(" ")[0]))
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
          <span>{avgImdbRating.toFixed(2)}</span>
        </p>
        <p>
          <span>🌟</span>
          <span>{avgUserRating.toFixed(2)}</span>
        </p>
        <p>
          <span>⏳</span>
          <span>{avgRuntime.toFixed(2)} min</span>
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
      {error && <ErrorMessage message={error} />}
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
function WatchedMovie({ movie, onRemove }) {
  return (
    <li key={movie.imdbID}>
      <img src={movie.poster} alt={`${movie.title} poster`} />
      <h3>{movie.title}</h3>
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
          <span>{movie.runtime}</span>
        </p>
      </div>
      <button className="btn-delete" onClick={() => onRemove(movie.imdbID)}>
        X
      </button>
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
