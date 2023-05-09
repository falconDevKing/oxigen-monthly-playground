import axios from "axios";

const baseUrl = process.env.BASE_URL;
const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;

const BASE_URL = process.env.BASE_URL;
const API_KEY = process.env.API_KEY;
const SITE_ID = process.env.SITE_ID;
const STAFF_USERNAME = process.env.STAFF_USERNAME;
const STAFF_PASSWORD = process.env.STAFF_PASSWORD;
const ACCESS_KEY = process.env.ACCESS_KEY;
const SECRET_ACCESS_KEY = process.env.SECRET_ACCESS_KEY;

console.log(BASE_URL, API_KEY, SITE_ID, STAFF_USERNAME, STAFF_PASSWORD, ACCESS_KEY, SECRET_ACCESS_KEY);

const AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: { "Content-Type": "application/json", "API-Key": apiKey, siteId: siteId },
});

export const doNothing = () => console.log("donothing");

export default AxiosInstance;
