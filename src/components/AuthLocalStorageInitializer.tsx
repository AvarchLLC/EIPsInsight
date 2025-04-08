'use client';

import { useAuthLocalStorage } from './useAuthLocalStorage';

export const AuthLocalStorageInitializer = () => {
  useAuthLocalStorage();
  return null;
};