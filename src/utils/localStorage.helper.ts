export function getLocalStorageItem(key: string): string | null {
  return localStorage.getItem(key);
}

export function setLocalStorageItem(key: string, value: string): void {
  localStorage.setItem(key, value);
}

export function removeLocalStorageItem(key: string): void {
  localStorage.removeItem(key);
}
