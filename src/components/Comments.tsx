import Giscus, { type Theme } from "@giscus/react";
import { GISCUS } from "@/constants";
import { useEffect, useState } from "react";

interface CommentsProps {
  lightTheme?: Theme;
  darkTheme?: Theme;
}

export default function Comments({
  lightTheme = "light",
  darkTheme = "dark",
}: CommentsProps) {
  const [theme, setTheme] = useState<Theme>(() => {
    try {
      const current = localStorage.getItem("theme");
      if (current === "dark") return "dark";
      if (current === "light") return "light";
      return window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => setTheme(e.matches ? "dark" : "light");
    try {
      mediaQuery.addEventListener("change", handleChange);
    } catch {
      // Safari fallback
      // @ts-ignore
      mediaQuery.addListener(handleChange);
    }

    const themeButton = document.querySelector("#theme-btn");
    const handleClick = () => setTheme(prev => (prev === "dark" ? "light" : "dark"));
    themeButton?.addEventListener("click", handleClick);

    return () => {
      try {
        mediaQuery.removeEventListener("change", handleChange);
      } catch {
        // @ts-ignore
        mediaQuery.removeListener(handleChange);
      }
      themeButton?.removeEventListener("click", handleClick);
    };
  }, []);

  return (
    <div className="mt-8" data-testid="giscus-comments">
      <Giscus {...GISCUS} theme={theme === "light" ? lightTheme : darkTheme} />
    </div>
  );
}
