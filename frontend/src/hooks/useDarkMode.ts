import { useEffect, useState } from "react";

export const useDarkMode = () => {
  const [dark, setDark] = useState<boolean>(() => {
    const saved = localStorage.getItem("syncflow_theme");
    if (saved) return saved === "dark";
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("syncflow_theme", dark ? "dark" : "light");
  }, [dark]);

  return { dark, toggle: () => setDark((d) => !d) };
};
