import { useState } from "react";

function useLocalStorage(key, initialValue) {
  const storedValue = localStorage.getItem(key);
  const [value, setValue] = useState(() => {
    if (storedValue) {
      return JSON.parse(storedValue);
    }
    return initialValue;
  });

  const setLocalStorage = (newValue) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, setLocalStorage];
}

export default useLocalStorage;
