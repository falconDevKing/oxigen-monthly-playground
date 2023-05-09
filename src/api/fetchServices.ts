import services from "../types/services";
import Axios from "../helpers/axiosInstance";

export default async function fetchServices(authToken: string) {
  try {
    let offsetValue = 0;

    let servicesData: any[] = [];

    const fetchServicesData = async () => {
      const fetchedServicesDataSet = await Axios.get("sale/services", {
        params: { limit: 200, offset: offsetValue, includeDiscontinued: false },
        headers: { Authorization: authToken },
      });
      const services = fetchedServicesDataSet.data?.Services;
      const requestedOffset = fetchedServicesDataSet.data?.PaginationResponse?.RequestedOffset;
      const pageSize = fetchedServicesDataSet.data?.PaginationResponse?.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedServicesDataSet.data?.PaginationResponse?.TotalResults;

      servicesData = [...servicesData, ...services];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchServicesData();
      }
    };

    await fetchServicesData();

    return servicesData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
