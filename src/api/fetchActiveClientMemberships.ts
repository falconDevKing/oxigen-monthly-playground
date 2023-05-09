import Axios from "../helpers/axiosInstance";

export default async function fetchActiveClientMemberships({ authToken, clientIds }: { authToken: string; clientIds: string[] }) {
  try {
    const offsetMax = 200;
    let offsetValue = 0;

    let clientsMembershipsObjectsArray: any[] = [];

    const fetchMembershipsData = async () => {
      const fetchedClientsMemberships = await Axios.get("client/activeclientsmemberships", {
        params: { limit: 200, offset: offsetValue, clientIds: clientIds },
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

    // const getUniqueMembershipCodes = (membershipsArray: any[]) => {
    //   const membershipsIds: number[] = membershipsArray.map((membership) => membership.MembershipId);

    //   const uniqueMembershipIds = Array.from(new Set(membershipsIds));
    //   return uniqueMembershipIds;
    // };

    // const clientsMembershipsIdsArray = clientsMembershipsObjectsArray
    //   .map((clientsMembershipsObject) => getUniqueMembershipCodes(clientsMembershipsObject.Memberships))
    //   .flat();

    return clientsMembershipsObjectsArray;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
