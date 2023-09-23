import { useEffect, useState } from "react";
import "../style.css";
import { Main } from "./Main";
import { WatchedMoviesList } from "./WatchedMoviesList";
import { Summary } from "./Summary";
import { Box } from "./Box";
import { MoviesList } from "./MoviesList";
import { Nav } from "./Nav";
import { Search } from "./Search";
import { NumberOfResults } from "./NumberOfResults";
import { useLocalStorage } from "../hooks/useLocalStorage";

const apiKey = "a6c1a1f6";
export const url = `http://www.omdbapi.com/?apikey=${apiKey}&`;
export default function App() {
  const [movies, setMovies] = useState([]);
  const [watched, setWatched] = useLocalStorage("watched");
  const [query, setQuery] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  function handleSelect(id) {
    setSelectedMovieId((prevMovieId) => (id === prevMovieId ? null : id));
  }
  function handleAddToWatchedList(movie) {
    setWatched((prevMovies) => [...prevMovies, movie]);
    handleUnselect();
  }
  function handleUnselect() {
    setSelectedMovieId(null);
  }
  function handleQueryChange(value) {
    setQuery(value);
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
      if (query.length < 3) return setMovies([]); //not searching until qury length is 3
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
        <Search onSearch={handleQueryChange} query={query} />
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
