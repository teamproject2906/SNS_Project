export const AUTH_KEY = "AUTH_TOKEN";
export const USER_KEY = "USER_KEY";
export const setObjectByKey = (KEY, VAL) => {
  localStorage.setItem(KEY, JSON.stringify(VAL));
};

export const getObjectByKey = (KEY) => {
  const value = localStorage.getItem(KEY);
  return value ? JSON.parse(value) : null;
};

export const removeObjectByKey = (KEY) => {
  localStorage.removeItem(KEY);
};
export const setToken = (token) => setObjectByKey(AUTH_KEY, token);
export const getToken = () => getObjectByKey(AUTH_KEY);
export const removeToken = () => removeObjectByKey(AUTH_KEY);
export const getUserInfo = () => JSON.parse(getObjectByKey(USER_KEY));
export const setUserInfo = (info) =>
  setObjectByKey(USER_KEY, JSON.stringify(info));
export const removeUserInfo = () => removeObjectByKey(USER_KEY);
