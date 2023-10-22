import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { atom } from "jotai";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function atomWithWebStorage(
  key: string,
  initialValue: string,
  storage = localStorage,
) {
  const baseAtom = atom(storage.getItem(key) ?? initialValue);
  return atom(
    (get) => get(baseAtom),
    (get, set, nextValue: string | undefined) => {
      if (nextValue == undefined) {
        storage.removeItem(key);
      } else {
        set(baseAtom, nextValue);
        storage.setItem(key, nextValue);
      }
    },
  );
}
