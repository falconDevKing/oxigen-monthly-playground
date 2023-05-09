import Axios from "../../helpers/axiosInstance";

export default async function fetchAccountBalance(authToken: string, clientsIds: string, balanceDate: string) {
  try {
    const clientIdsArray = (clientsIds as string).split(",");

    let offsetValue = 0;

    let accountBalanceData: any[] = [];

    const fetchAccountBalanceData = async () => {
      const fetchedAccountBalanceDataSet = await Axios.get("client/clientaccountbalances", {
        params: { limit: 200, offset: offsetValue, balanceDate, clientIds: clientIdsArray },
        headers: { Authorization: authToken },
      });
      const accountBalance = fetchedAccountBalanceDataSet.data.Clients;
      const requestedOffset = fetchedAccountBalanceDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedAccountBalanceDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedAccountBalanceDataSet.data.PaginationResponse.TotalResults;

      accountBalanceData = [...accountBalanceData, ...accountBalance];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchAccountBalanceData();
      }
    };

    await fetchAccountBalanceData();

    return accountBalanceData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
