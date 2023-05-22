import moment from "moment";
import { modifyDate } from "../helpers/helpers";
import clientType from "../types/clientType";

export const activeLeadsIdsCreator = (clientsData: clientType[], upperFilterDate: string, weekBegin: string) => {
  const activeLeadsIds = clientsData.reduce((accumulator, currentValue) => {
    const modFilterDate = modifyDate(currentValue?.CreationDate);
    if (
      currentValue.Status === "Active" ||
      (moment(modFilterDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour"))
    ) {
      return [...accumulator, currentValue.Id];
    } else {
      return accumulator;
    }
  }, [] as string[]);
  return activeLeadsIds;
};

export const groupIdsCreator = (activeLeadsIds: string[], authToken: string) => {
  const activeLeadslength = activeLeadsIds.length;
  let offsetValue = 0;

  const groupedIds: { authToken: string; clientIds: string[] }[] = [];

  const groupIds = () => {
    const selectedIds = activeLeadsIds.slice(offsetValue, offsetValue + 200);
    groupedIds.push({ authToken, clientIds: selectedIds });
    offsetValue += 200;

    if (offsetValue < activeLeadslength) {
      groupIds();
    }
  };

  groupIds();

  return groupedIds;
};
