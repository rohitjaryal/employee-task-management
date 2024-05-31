import axios from "axios";
import { TOKEN_KEY } from "@/utils/constants.ts";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

fetchRequest.defaults.headers.common["Authorization"] =
  window.localStorage.getItem(TOKEN_KEY);

export default fetchRequest;
