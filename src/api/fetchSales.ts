import Axios from "../helpers/axiosInstance";
import salesType from "../types/sales";

export default async function fetchSales(authToken: string, startSaleDateTime: string, endSaleDateTime: string) {
  try {
    let offsetValue = 0;

    let salesData: any[] = [];

    const fetchsalesData = async () => {
      const fetchedSalesDataSet = await Axios.get("sale/sales", {
        params: { limit: 200, offset: offsetValue, startSaleDateTime, endSaleDateTime },
        headers: { Authorization: authToken },
      });
      const sales = fetchedSalesDataSet.data?.Sales;
      const requestedOffset = fetchedSalesDataSet.data?.PaginationResponse?.RequestedOffset;
      const pageSize = fetchedSalesDataSet.data?.PaginationResponse?.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedSalesDataSet.data?.PaginationResponse?.TotalResults;

      salesData = [...salesData, ...sales];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchsalesData();
      }
    };

    await fetchsalesData();

    return salesData;
  } catch (err: any) {
    console.log("Error getting sales", err?.message, err);
    throw new Error(err?.message ?? "Error getting sales");
  }
}
