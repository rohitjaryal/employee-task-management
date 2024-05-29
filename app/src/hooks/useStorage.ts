import {
  POSSIBLE_USER_TYPE,
  TOKEN_KEY,
  USER_INFO_KEY,
  USER_TYPE_KEY,
} from "@/utils/constants.ts";

export const useStorage = () => {
  function setToken(value: string) {
    window.localStorage.setItem(TOKEN_KEY, value);
  }

  function getToken() {
    return window.localStorage.getItem(TOKEN_KEY);
  }
  function setUserType(value: keyof typeof POSSIBLE_USER_TYPE) {
    window.localStorage.setItem(USER_TYPE_KEY, value);
  }

  function getUserType() {
    return window.localStorage.getItem(USER_TYPE_KEY);
  }

  function setUserInfo(data: {
    userName?: string;
    userId?: string;
    userType?: string;
  }) {
    const info = {
      ...data,
    };
    window.localStorage.setItem(USER_INFO_KEY, JSON.stringify(info));
  }

  function getUserInfo() {
    const info = window.localStorage.getItem(USER_INFO_KEY);
    if (!info) {
      return {};
    }
    return JSON.parse(info);
  }

  const isEmployee = getUserInfo()?.userType === POSSIBLE_USER_TYPE.EMPLOYEE;
  const isAdmin = getUserInfo()?.userType === POSSIBLE_USER_TYPE.ADMIN;

  return {
    setToken,
    getToken,
    setUserType,
    getUserType,
    isEmployee,
    isAdmin,
    setUserInfo,
    getUserInfo,
  };
};
