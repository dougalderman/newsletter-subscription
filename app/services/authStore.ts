let inMemoryToken: string | null = null;

export const getAccessToken = (): string | null => inMemoryToken;

export const setAccessToken = (token: string | null): void => {
  inMemoryToken = token;
};