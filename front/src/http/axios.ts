import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:5262",
  headers: {'X-Custom-Header': 'foobar'}
});