/* =========================================================
   MindSpace — LocalStorage Persistence Layer
   ========================================================= */

const PREFIX = 'mindspace_';

function getKey(key: string): string {
  return `${PREFIX}${key}`;
}

export function loadData<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(getKey(key));
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveData<T>(key: string, data: T): void {
  try {
    localStorage.setItem(getKey(key), JSON.stringify(data));
  } catch (e) {
    console.error(`[MindSpace] Failed to save ${key}:`, e);
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}
