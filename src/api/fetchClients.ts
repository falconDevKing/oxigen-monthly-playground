import clientType from "../types/clientType";
import Axios from "../helpers/axiosInstance";

export default async function fetchClients(authToken: string) {
  try {
    let offsetValue = 0;

    let clientData: any[] = [];

    const fetchclientData = async () => {
      const fetchedClientsDataSet = await Axios.get("client/clients", { params: { limit: 200, offset: offsetValue }, headers: { Authorization: authToken } });
      const clients = fetchedClientsDataSet.data.Clients;
      const requestedOffset = fetchedClientsDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedClientsDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedClientsDataSet.data.PaginationResponse.TotalResults;

      clientData = [...clientData, ...clients];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchclientData();
      }
    };

    await fetchclientData();

    return clientData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
