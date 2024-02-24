"use client";

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";

interface ThemeContextType {
  mode: string;
  setMode: Dispatch<SetStateAction<string>>;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setMode] = useState("");

  const handleThemeChange = () => {
    if (
      localStorage.theme === "dark" ||
      (!("theme" in localStorage) &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
    ) {
      setMode("dark");
      document.documentElement.classList.add("dark");
    } else {
      setMode("light");
      document.documentElement.classList.remove("dark");
    }
  };

  useEffect(() => {
    handleThemeChange();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

const useTheme = () => {
  const context = useContext(ThemeContext);

  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }

  return context;
};

export { useTheme };
export default ThemeProvider;
