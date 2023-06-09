import Axios from "../helpers/axiosInstance";

export default async function fetchActiveClientMemberships({ authToken, clientId }: { authToken: string; clientId: string }) {
  try {
    const offsetMax = 200;
    let offsetValue = 0;

    let clientsMembershipsObjectsArray: any[] = [];

    const fetchMembershipsData = async () => {
      const fetchedClientsMemberships = await Axios.get("client/activeclientmemberships", {
        params: { limit: 200, offset: offsetValue, clientId: clientId },
        headers: { Authorization: authToken },
      });
      const clientMemberships = fetchedClientsMemberships.data.ClientMemberships;
      const requestedOffset = fetchedClientsMemberships.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedClientsMemberships.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedClientsMemberships.data.PaginationResponse.TotalResults;

      clientsMembershipsObjectsArray = [...clientsMembershipsObjectsArray, ...clientMemberships]; // [m,m] // [{m},{m}]

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchMembershipsData();
      }
    };

    await fetchMembershipsData();

    return { ClientId: clientId, Memberships: clientsMembershipsObjectsArray };
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
