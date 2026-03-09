import { useEffect, useState } from "react";

const getPath = () => window.location.pathname || "/";

export const navigateTo = (to) => {
  if (!to) return;
  if (to === getPath()) return;
  window.history.pushState({}, "", to);
  window.dispatchEvent(new PopStateEvent("popstate"));
  window.scrollTo(0, 0);
};

export function useRoutePath() {
  const [path, setPath] = useState(getPath);

  useEffect(() => {
    const handlePop = () => setPath(getPath());
    window.addEventListener("popstate", handlePop);
    return () => window.removeEventListener("popstate", handlePop);
  }, []);

  return path;
}
