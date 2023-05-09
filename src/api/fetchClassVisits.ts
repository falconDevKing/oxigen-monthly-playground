import visit from "../types/visit";
import Axios from "../helpers/axiosInstance";

export default async function fetchClassVisits({ authToken, classId }: { authToken: string; classId: number }) {
  try {
    const fetchClassVisitsData = async () => {
      const fetchedclassVisitsDataSet = await Axios.get("class/classvisits", {
        params: { classId },
        headers: { Authorization: authToken },
      });
      const classVisits = fetchedclassVisitsDataSet.data.Class.Visits;

      return classVisits;
    };

    const classVisitsData: any[] = await fetchClassVisitsData();
    return classVisitsData;
  } catch (err: any) {
    console.log("Error getting classs visits", err?.message, err);
    throw new Error(err?.message ?? "Error getting classs visits");
  }
}
