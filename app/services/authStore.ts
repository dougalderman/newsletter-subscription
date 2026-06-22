let inMemoryToken: string | null = null;
let adminAuthorized: boolean = false;

export const getAccessToken = (): string | null => inMemoryToken;
export const isAdminAuthorized = (): boolean => adminAuthorized;

export const setAuth = (token: string | null, isAdmin: boolean): void => {
  inMemoryToken = token;
  adminAuthorized = isAdmin;
};

export const clearAuth = (): void => setAuth(null, false);