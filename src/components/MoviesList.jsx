import { Loader } from "./Loader";
import { ErrorMessage } from "./ErrorMessage";
import { Movie } from "./Movie";

export function MoviesList({ movies, isLoading, error, onSelect }) {
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
