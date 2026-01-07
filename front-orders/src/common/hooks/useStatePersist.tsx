import { Dispatch, SetStateAction, useEffect, useState } from 'react';

type SaveableData = string | number | object | boolean | undefined | null;

export function useStatePersist<T extends SaveableData>(
  defaultValue: T,
  key: string,
  initialization?: (savedValue: T) => T
): [value: T, setValue: Dispatch<SetStateAction<T>>] {
  const [value, setValue] = useState(() => {
    const v = localStorage.getItem(key);
    if (v === null) {
      return defaultValue;
    }

    try {
      // if we have an initialization function, apply that to the
      // value we retrieved from localStorage
      const saved = JSON.parse(v) as T;
      return initialization ? initialization(saved) : saved;
    } catch (e) {
      return defaultValue;
    }
  });

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);

  return [value, setValue];
}
