import { useEffect } from "react";
import { useRef } from "react";

export function Search({ query, onSearch }) {
  const searchEl = useRef(null);
  useEffect(
    function () {
      function callback(e) {
        console.log("e :>> ", e);
        if (e.key !== "Enter" || document.activeElement === searchEl.current)
          return;
        onSearch("");
        searchEl.current.focus();
      }
      document.addEventListener("keydown", callback);
    },
    [onSearch, searchEl]
  );
  return (
    <input
      ref={searchEl}
      className="search"
      type="text"
      placeholder="Search movies..."
      value={query}
      onChange={(e) => onSearch(e.target.value)}
    />
  );
}
