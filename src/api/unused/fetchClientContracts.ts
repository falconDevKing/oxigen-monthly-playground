import Axios from "../../helpers/axiosInstance";

export default async function handler(authToken: string, clientId: string) {
  try {
    const offsetMax = 200;
    let offsetValue = 0;

    let clientContractsData: any[] = [];

    const fetchclientContractsData = async () => {
      const fetchedClientContractsDataSet = await Axios.get("client/clientcontracts", {
        params: { limit: 200, offset: offsetValue, clientId },
        headers: { Authorization: authToken },
      });
      const clientContracts = fetchedClientContractsDataSet.data.Contracts;
      const requestedOffset = fetchedClientContractsDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedClientContractsDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedClientContractsDataSet.data.PaginationResponse.TotalResults;

      clientContractsData = [...clientContractsData, ...clientContracts];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchclientContractsData();
      }
    };

    await fetchclientContractsData();
    return clientContractsData;
  } catch (err: any) {
    console.log("Error getting clientContracts", err?.message, err);
    throw new Error(err?.message ?? "Error getting clientContracts");
  }
}
