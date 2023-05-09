import visit from "../types/visit";
import Axios from "../helpers/axiosInstance";

export default async function fetchClasses(authToken: string, startDateTime: string, endDateTime: string) {
  try {
    let offsetValue = 0;

    let classesData: any[] = [];

    const fetchClassesData = async () => {
      const fetchedClassesDataSet = await Axios.get("class/classes", {
        params: { limit: 200, offset: offsetValue, startDateTime, endDateTime },
        headers: { Authorization: authToken },
      });
      const classes = fetchedClassesDataSet.data.Classes;
      const requestedOffset = fetchedClassesDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedClassesDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedClassesDataSet.data.PaginationResponse.TotalResults;

      classesData = [...classesData, ...classes];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchClassesData();
      }
    };

    await fetchClassesData();

    return classesData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
