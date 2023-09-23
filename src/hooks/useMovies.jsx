import { useEffect } from "react";
import { useState } from "react";
import { url } from "../components/App";

export function useMovies(query) {
  const [movies, setMovies] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(
    function () {
      const controller = new AbortController();
      async function search() {
        try {
          setIsLoading(true);
          setError(null);
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
      if (query.length < 3) {
        setError(null);
        setMovies([]);
        return;
      } //not searching until qury length is 3
      search();
      return function () {
        controller.abort();
      };
    },
    [query]
  );
  return { error, isLoading, movies };
}
