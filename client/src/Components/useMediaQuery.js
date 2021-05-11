import { useEffect, useState } from "react";

export default function useMediaQuery() {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(min-width: 800px)");
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addEventListener("change", listener);
    // media.addListener(listener);
    // return () => media.removeListener(listener);
    return () => media.removeEventListener("change", listener);
  }, [matches]);
  return matches;
}
