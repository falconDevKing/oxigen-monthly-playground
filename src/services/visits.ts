import moment from "moment";
import { modifyDate } from "../helpers/helpers";
import visitType from "../types/visit";

export const visitAnalysis = (monthClassesVisits: visitType[], previousMonthBegin: string) => {
  let missedVisits = 0;
  let unpaidVisits = 0;
  let missedVisitsArray: string[] = [];
  let unpaidVisitsArray: string[] = [];
  const attendance = monthClassesVisits.reduce((accumulator, currentValue) => {
    const modFilterDate = modifyDate(currentValue.StartDateTime as string);
    if (moment(modFilterDate).isSameOrAfter(previousMonthBegin)) {
      if (currentValue.Missed) {
        missedVisits += 1;
        missedVisitsArray = [...missedVisitsArray, currentValue.ClientId as string];
        return accumulator;
      }
      if (!currentValue.Missed && (!currentValue.ServiceId || !currentValue.ProductId)) {
        unpaidVisits += 1;
        unpaidVisitsArray = [...unpaidVisitsArray, currentValue.ClientId as string];
      }
      return accumulator + 1;
    }
    return accumulator;
  }, 0);

  return { attendance, missedVisits, unpaidVisits, missedVisitsArray, unpaidVisitsArray };
};
