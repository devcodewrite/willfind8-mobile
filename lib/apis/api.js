import axios from "axios";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    "x-appapitoken": process.env.EXPO_PUBLIC_APP_API_KEY,
  },
});

export default api;
