import { useEffect } from "react";

export function useKey(key, callback) {
  useEffect(function () {
    function cb(e) {
      console.log("e :>> ", e);
      if (e.key.toLowerCase() !== key.toLowerCase()) return;
      callback();
    }
    document.addEventListener("keydown", cb);
    return () => document.removeEventListener("keydown", cb);
  }, []);
}
