import visit from "../types/visit";
import Axios from "../helpers/axiosInstance";

export default async function fetchAppointments(authToken: string, startDate: string, endDate: string) {
  try {
    let offsetValue = 0;

    let AppointmentsData: any[] = [];

    const fetchAppointmentsData = async () => {
      const fetchedAppointmentsDataSet = await Axios.get("appointment/staffappointments", {
        params: { limit: 200, offset: offsetValue, startDate, endDate, staffIds: 0 },
        headers: { Authorization: authToken },
      });
      const Appointments = fetchedAppointmentsDataSet.data.Appointments;
      const requestedOffset = fetchedAppointmentsDataSet.data.PaginationResponse.RequestedOffset;
      const pageSize = fetchedAppointmentsDataSet.data.PaginationResponse.PageSize;
      const nextOffset = requestedOffset + pageSize;
      const totalResultSize = fetchedAppointmentsDataSet.data.PaginationResponse.TotalResults;

      AppointmentsData = [...AppointmentsData, ...Appointments];

      if (nextOffset < totalResultSize) {
        offsetValue = nextOffset;
        await fetchAppointmentsData();
      }
    };

    await fetchAppointmentsData();

    return AppointmentsData;
  } catch (err: any) {
    console.log("Error getting clients", err?.message, err);
    throw new Error(err?.message ?? "Error getting clients");
  }
}
