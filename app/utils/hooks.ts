import { useEffect, useMemo, useRef } from "react";
import { Theme } from "@/app/store";

export const useTheme = () => {
  const ele = useRef(document.querySelector("html"));

  useEffect(() => {
    if (ele.current) return;
    ele.current = document.querySelector("html");
  }, []);

  const getTheme = () => {
    if (!ele.current) return null;
    return ele.current.dataset.theme as Theme;
  };

  const toggle = () => {
    if (!ele.current) return Theme.Auto;
    const theme = getTheme();
    let toggledTheme = Theme.Auto;
    switch (theme) {
      case Theme.Light:
        toggledTheme = Theme.Dark;
        break;
      case Theme.Dark:
        toggledTheme = Theme.Light;
        break;
      default:
        toggledTheme = Theme.Light;
        break;
    }
    ele.current.setAttribute("data-theme", toggledTheme);
    return toggledTheme;
  };

  return {
    getTheme,
    toggle,
  };
};

export const useInterval = (callback: Function, delay?: number | null) => {
  const ref = useRef(0);
  const savedCallback = useRef<Function>(() => {});

  useEffect(() => {
    savedCallback.current = callback;
  });

  useEffect(() => {
    if (delay !== null) {
      ref.current = setInterval(
        () => savedCallback.current(),
        delay || 0,
      ) as unknown as number;
      return () => clearInterval(ref.current);
    }

    return undefined;
  }, [delay]);

  return () => {
    clearInterval(ref.current);
  };
};
