import { useState, useEffect } from "react";

export const useLocalStorage = <T>(key: string, initialValue: T) => {
  // localStorage only works on the client side
  // When first render on server side for hydration, use the initialValue for useState
  const [value, setValue] = useState<T>(initialValue);

  // On client side, use useEffect to get value from localStorage and then set it to useState
  useEffect(() => {
    const stored = localStorage.getItem(key);
    if (stored) setValue(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue] as const;
};
