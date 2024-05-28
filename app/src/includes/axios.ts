import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const fetchRequest = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// fetchRequest.interceptors.request.use(
//     (config) => {
//         const loaderStore = useLoaderStore();
//
//         loaderStore.isLoading = true;
//         return config;
//     },
//     (error) => {
//         console.error(error);
//         return Promise.reject(error);
//     }
// );
//
//------starts
// fetchRequest.interceptors.response.use(
//   (response) => {
//     return response.data?.data;
//   },
//   (error) => {
//     if (error.response.status === 401) {
//       alert("User not logged in.");
//     }
//     return Promise.reject(error.message);
//   },
// );
//------ends
//
fetchRequest.defaults.headers.common["Authorization"] =
  window.localStorage.getItem("token");

export default fetchRequest;
