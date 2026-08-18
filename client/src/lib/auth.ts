export const getToken = (): string | null => {
  const match = document.cookie.match(/accessToken=([^;]+)/);
  return match ? match[1] : null;
};

export const setToken = (token: string): void => {
  document.cookie = `accessToken=${token}; path=/; max-age=${15 * 60}; SameSite=Lax`;
};

export const removeToken = (): void => {
  document.cookie = 'accessToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
};

export const getUser = (): string | null => {
  const user = localStorage.getItem('user');
  return user;
};

export const setUser = (user: string): void => {
  localStorage.setItem('user', user);
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};
