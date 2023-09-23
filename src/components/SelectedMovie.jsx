import { useEffect, useState } from "react";
import StarRating from "./StarRating";
import { Loader } from "./Loader";
import { url } from "./App";
import { useKey } from "../hooks/useKey";

export function SelectedMovie({
  selectedMovieId,
  onUnselect,
  onWatch,
  watched,
}) {
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
  useKey("Escape", onUnselect);
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
