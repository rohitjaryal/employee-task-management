import {
  POSSIBLE_USER_TYPE,
  TOKEN_KEY,
  USER_CHAT_SESSION_KEY,
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

  function setUserInfo(data: {
    userName?: string;
    userId?: string;
    userType?: string;
    commonUserIdentifier?: string;
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

  const userName = getUserInfo().userName;
  const commonUserIdentifier = getUserInfo().commonUserIdentifier;

  function deleteToken() {
    window.localStorage.removeItem(TOKEN_KEY);
  }

  function deleteChatSession() {
    window.localStorage.removeItem(USER_CHAT_SESSION_KEY);
  }

  function setChatSession(value: string) {
    window.localStorage.setItem(USER_CHAT_SESSION_KEY, value);
  }

  function getChatSession() {
    window.localStorage.getItem(USER_CHAT_SESSION_KEY);
  }

  const userType = getUserInfo()?.userType;

  function deleteUserInfo() {
    window.localStorage.removeItem(USER_INFO_KEY);
  }

  return {
    setToken,
    getToken,
    isEmployee,
    isAdmin,
    setUserInfo,
    getUserInfo,
    userName,
    commonUserIdentifier,
    deleteToken,
    deleteChatSession,
    setChatSession,
    getChatSession,
    userType,
    deleteUserInfo,
  };
};
