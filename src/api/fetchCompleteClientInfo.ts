import completeClientInfo from "../types/completeClientInfo";
import Axios from "../helpers/axiosInstance";

// export default async function fetchCompleteClientInfo({ authToken, clientId, startDate, endDate }: { [x: string]: string }) {
export default async function fetchCompleteClientInfo({ clientId, authToken, startDate, endDate }: any) {
  try {
    const fetchCompleteClientInfoData = async () => {
      const fetchedCompleteClientInfoDataSet = await Axios.get("client/clientcompleteinfo", {
        params: { startDate, endDate, clientId },
        headers: { Authorization: authToken },
      });
      return fetchedCompleteClientInfoDataSet.data;
    };

    let clientData = await fetchCompleteClientInfoData();

    return clientData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
