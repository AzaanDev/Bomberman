import axios from "axios";
import store from "../store/Store";

const client = axios.create({
  baseURL: "http://localhost:5062/",
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  (c) => {
    const token = store.getState().Auth.token;
    if (token) {
      c.headers["Authorization"] = `Bearer ${token}`;
    }
    return c;
  },
  (e) => {
    return Promise.reject(e);
  }
);

export default client;
