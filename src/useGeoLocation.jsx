import { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";

function useGeolocation(element, event) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [position, setPosition] = useState({});

  useEffect(
    function () {
      function callback(e) {
        console.log(e.target, element);
        if (e.target !== element) return;
        if (!navigator.geolocation)
          return setError("Your browser does not support geolocation");

        setIsLoading(true);
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            setPosition({
              lat: pos.coords.latitude,
              lng: pos.coords.longitude,
            });
            setIsLoading(false);
          },
          (error) => {
            setError(error.message);
            setIsLoading(false);
          }
        );
      }
      document.addEventListener(event, callback);
    },

    [element, event]
  );
  return { error, position, isLoading };
}

export default function App() {
  const [countClicks, setCountClicks] = useState(0);
  const btnEl = useRef(null);
  const {
    error,
    position: { lat, lng },
    isLoading,
  } = useGeolocation(btnEl.current, "click");
  function handleGetPostion() {
    setCountClicks((c) => c + 1);
  }
  return (
    <div>
      <button onClick={handleGetPostion} disabled={isLoading} ref={btnEl}>
        Get my position
      </button>

      {isLoading && <p>Loading position...</p>}
      {error && <p>{error}</p>}
      {!isLoading && !error && lat && lng && (
        <p>
          Your GPS position:{" "}
          <a
            target="_blank"
            rel="noreferrer"
            href={`https://www.openstreetmap.org/#map=16/${lat}/${lng}`}
          >
            {lat}, {lng}
          </a>
        </p>
      )}

      <p>You requested position {countClicks} times</p>
    </div>
  );
}
