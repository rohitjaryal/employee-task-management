import { USER_INFO_KEY } from "@/utils/constants.ts";

function parseResponse(response: any) {
  return response?.data?.data;
}

function getUserInfo() {
  const userInfo = window.localStorage.getItem(USER_INFO_KEY);
  if (!userInfo) {
    return null;
  }
  return JSON.parse(userInfo);
}

export { parseResponse, getUserInfo };
