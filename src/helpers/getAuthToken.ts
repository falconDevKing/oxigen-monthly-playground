import axios from "axios";

const apiKey = process.env.API_KEY;
const siteId = process.env.SITE_ID;
const username = process.env.STAFF_USERNAME;
const password = process.env.STAFF_PASSWORD;

const getBearerToken = async () => {
  const authTokenData = await axios.post(
    "https://api.mindbodyonline.com/public/v6/usertoken/issue",
    {
      username,
      password,
    },
    { headers: { "Content-Type": "application/json", "API-Key": apiKey, siteId: siteId } }
  );
  const authToken = "Bearer " + authTokenData.data.AccessToken;
  return authToken;
};

export default getBearerToken;
