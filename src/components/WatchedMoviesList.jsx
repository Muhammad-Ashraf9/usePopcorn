import { WatchedMovie } from "./WatchedMovie";
import { SelectedMovie } from "./SelectedMovie";

export function WatchedMoviesList({
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
