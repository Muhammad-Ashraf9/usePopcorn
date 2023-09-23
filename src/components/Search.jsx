import { useRef } from "react";
import { useKey } from "../hooks/useKey";

export function Search({ query, onSearch }) {
  const searchEl = useRef(null);

  useKey("Enter", function () {
    if (document.activeElement === searchEl.current) return;
    onSearch("");
    searchEl.current.focus();
  });
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
