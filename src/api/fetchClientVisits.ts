import visit, { activeLeadsClientInfoParams } from "../types/visit";
import Axios from "../helpers/axiosInstance";

export default async function fetchClientVisits({ authToken, clientId, startDate, endDate, unpaidsOnly }: activeLeadsClientInfoParams) {
  try {
    let offsetValue = 0;

    let clientVisitsData: any[] = [];

    const fetchclientVisitsData = async () => {
      const fetchedClientVisitsDataSet = await Axios.get("client/clientvisits", {
        params: { limit: 200, offset: offsetValue, startDate, endDate, clientId, unpaidsOnly: unpaidsOnly ?? false },
        headers: { Authorization: authToken },
      });
      const clientVisits = fetchedClientVisitsDataSet.data.Visits;
      const requestedOffset = fetchedClientVisitsDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedClientVisitsDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedClientVisitsDataSet.data.PaginationResponse.TotalResults;

      clientVisitsData = [...clientVisitsData, ...clientVisits];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchclientVisitsData();
      }
    };

    await fetchclientVisitsData();

    return clientVisitsData;
  } catch (err: any) {
    console.log("Error getting clientvisits", err?.message, err);
    throw new Error(err?.message ?? "Error getting clientvisits");
  }
}
