type StorageData<T> = {
  value: T;
  expiry: number;
};

export const setWithExpiry = <T>(key: string, value: T, ttl: number): void => {
  const now = new Date();
  const item: StorageData<T> = {
    value,
    expiry: now.getTime() + ttl,
  };
  localStorage.setItem(key, JSON.stringify(item));
};

export const getWithExpiry = <T>(key: string): T | null => {
  const itemStr = localStorage.getItem(key);
  
  if (!itemStr) return null;
  
  try {
    const item: StorageData<T> = JSON.parse(itemStr);
    const now = new Date();
    
    if (now.getTime() > item.expiry) {
      localStorage.removeItem(key);
      return null;
    }
    
    return item.value;
  } catch (error) {
    console.error('Error parsing stored item:', error);
    localStorage.removeItem(key);
    return null;
  }
};

export const removeItem = (key: string): void => {
  localStorage.removeItem(key);
};

export const clearStorage = (): void => {
  localStorage.clear();
}; 