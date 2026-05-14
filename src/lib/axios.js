import axios from "axios";

const api = axios.create({
  baseURL: "https://thinkpad-backend-m933.onrender.com/api",
});

export default api;