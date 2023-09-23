import { useEffect } from "react";
import { useState } from "react";

export function useLocalStorage(key) {
  const [value, setValue] = useState(function () {
    const watchedList = localStorage.getItem(key);
    return watchedList ? JSON.parse(watchedList) : [];
  });
  useEffect(
    function () {
      localStorage.setItem(key, JSON.stringify(value));
    },
    [value, key]
  );
  return [value, setValue];
}
