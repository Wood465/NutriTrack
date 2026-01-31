const getStore = () => {
  const store = globalThis as unknown as {
    __signInCalls?: number;
  };
  if (typeof store.__signInCalls !== 'number') {
    store.__signInCalls = 0;
  }
  return store;
};

export const signIn = () => {
  const store = getStore();
  store.__signInCalls = (store.__signInCalls ?? 0) + 1;
  return Promise.resolve();
};

export const __getSignInCalls = () => getStore().__signInCalls ?? 0;

export const __resetSignInCalls = () => {
  getStore().__signInCalls = 0;
};
