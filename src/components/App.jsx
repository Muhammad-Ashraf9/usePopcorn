import { useState } from "react";
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
import { useMovies } from "../hooks/useMovies";

const apiKey = "a6c1a1f6";
export const url = `http://www.omdbapi.com/?apikey=${apiKey}&`;
export default function App() {
  const [selectedMovieId, setSelectedMovieId] = useState(null);
  const [watched, setWatched] = useLocalStorage([], "watched");
  const [query, setQuery] = useState("");

  const { error, isLoading, movies } = useMovies(query);
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
