import { User } from '@/types/auth';

const AUTH_TOKEN_KEY = 'classbook_token';
const AUTH_USER_KEY = 'classbook_user';

export const authStorage = {
  getToken(): string | null {
    return localStorage.getItem(AUTH_TOKEN_KEY);
  },

  setToken(token: string): void {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
  },

  removeToken(): void {
    localStorage.removeItem(AUTH_TOKEN_KEY);
  },

  getUser(): User | null {
    const user = localStorage.getItem(AUTH_USER_KEY);
    return user ? JSON.parse(user) : null;
  },

  setUser(user: User): void {
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
  },

  removeUser(): void {
    localStorage.removeItem(AUTH_USER_KEY);
  },

  clear(): void {
    this.removeToken();
    this.removeUser();
  }
};

export const isAuthenticated = (): boolean => {
  return !!authStorage.getToken() && !!authStorage.getUser();
};

export const isAdmin = (): boolean => {
  const user = authStorage.getUser();
  return user?.role === 'ADMIN';
};