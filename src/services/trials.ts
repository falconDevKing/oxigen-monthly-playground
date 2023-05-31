import moment from "moment";
import clientType from "../types/clientType";
import { modifyDate } from "../helpers/helpers";
import salesType, { PurchasedItems, modifiedPurchasedItems } from "../types/sales";
import completeClientInfo from "../types/completeClientInfo";
import visitType, { activeLeadsClientInfoParams } from "../types/visit";

export const monthTrialsPurchasedAnalysis = (
  sales: salesType[],
  introServicesIds: number[],
  authToken: string,
  previousMonthBegin: string,
  monthBegin: string
) => {
  //get trials purchased --> 27, N
  //get trials purchasers ids --> 28
  let monthTrialsPurchased = 0;
  const monthTrialsPurchasersIds = sales
    .reduce((accumulator, currentValue) => {
      const modFilterDate = modifyDate(currentValue.SaleDateTime);
      if (moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") && moment(monthBegin).isAfter(modFilterDate, "hour")) {
        const modifiedPurchasedItems: modifiedPurchasedItems[] = currentValue.PurchasedItems?.map((purchasedItem) => ({
          ...purchasedItem,
          clientId: currentValue.ClientId,
        }));

        return [...accumulator, ...modifiedPurchasedItems];
      } else {
        return accumulator;
      }
    }, [] as modifiedPurchasedItems[])
    .flat()
    .reduce((accum, curVal) => {
      if (introServicesIds.includes(curVal.Id)) {
        monthTrialsPurchased += 1;
        return [...accum, curVal.clientId];
      } else {
        return accum;
      }
    }, [] as string[]);

  //fetch trial purcahsers Visits params --> 29
  const monthTrialsPurchasersIdsParams = monthTrialsPurchasersIds.reduce((accumulator, currentValue) => {
    return [...accumulator, { clientId: currentValue, authToken, startDate: previousMonthBegin, endDate: monthBegin }];
  }, [] as activeLeadsClientInfoParams[]);

  return { monthTrialsPurchased, monthTrialsPurchasersIds, monthTrialsPurchasersIdsParams };
};

export const trialsFirstVisitAnalysis = (
  clientsData: clientType[],
  monthTrialsToVisits: visitType[][],
  monthTrialsPurchasersIds: string[],
  authToken: string,
  previousMonthBegin: string,
  monthBegin: string
) => {
  // get trials first visits for month ---> 30,O
  // get trials first visits for month Ids ---> 31
  const attendedTrialVisits = monthTrialsToVisits.flat().reduce((accumulator, visit) => {
    if (!visit.Missed) {
      return [...accumulator, { ClientId: visit.ClientId as string, attended: !visit.Missed as boolean }];
    }
    return accumulator;
  }, [] as { ClientId: string; attended: boolean }[]);

  let monthTrialsToFirstVisited = 0;
  const monthTrialPurcahsersWithFirstVisitIds = monthTrialsPurchasersIds.reduce((accum, curVal) => {
    const clientData = clientsData.find((client) => client.Id === curVal);

    if (!clientData) {
      return accum;
    }

    if (clientData?.FirstClassDate) {
      const modFilterDate = modifyDate(clientData?.FirstClassDate);
      if (moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") && moment(monthBegin).isAfter(modFilterDate, "hour")) {
        const clientsAttended = attendedTrialVisits.filter((visit) => visit.ClientId === curVal).length;

        if (clientsAttended) {
          monthTrialsToFirstVisited += 1;
          return [...accum, clientData?.Id];
        }
      }
    }

    return accum;
  }, [] as string[]);

  // get trials purchasers with visits to billed members -> 33, Q
  const monthTrialPurcahsersWithFirstVisitIdsParams = monthTrialPurcahsersWithFirstVisitIds.map((monthTrialPurcahsersWithFirstVisitId) => ({
    authToken,
    clientId: monthTrialPurcahsersWithFirstVisitId,
    startDate: previousMonthBegin,
    endDate: monthBegin,
  }));

  return { monthTrialsToFirstVisited, monthTrialPurcahsersWithFirstVisitIds, monthTrialPurcahsersWithFirstVisitIdsParams };
};

export const monthTrialsPurcahsersWithVisitToBilledAnalysis = (monthTrialPurcahsersWithFirstVisitIdsCompleteClients: completeClientInfo[]) => {
  let monthTrialPurcahsersWithVisitToBilled = 0;
  const monthTrialPurcahsersWithVisitToBilledIds = monthTrialPurcahsersWithFirstVisitIdsCompleteClients.reduce((accumulator, currentValue) => {
    if (currentValue.ClientContracts.length) {
      monthTrialPurcahsersWithVisitToBilled += 1;
      return [...accumulator, currentValue.Client.Id];
    }
    return accumulator;
  }, [] as string[]);

  return { monthTrialPurcahsersWithVisitToBilled, monthTrialPurcahsersWithVisitToBilledIds };
};

export const salesByServicesAnalysis = (sales: salesType[], packsUpfrontIds: number[], previousMonthBegin: string, monthBegin: string) => {
  // get packs and upfront for month ---> 35,S
  let monthPacksUpfront = 0;
  const monthPacksUpfrontIds = sales
    .reduce((accumulator, currentValue) => {
      const modFilterDate = modifyDate(currentValue.SaleDateTime);
      if (moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") && moment(monthBegin).isAfter(modFilterDate, "hour")) {
        const modifiedPurchasedItems: modifiedPurchasedItems[] = currentValue.PurchasedItems.map((purchasedItem) => ({
          ...purchasedItem,
          clientId: currentValue.ClientId,
        }));

        return [...accumulator, ...modifiedPurchasedItems];
      } else {
        return accumulator;
      }
    }, [] as modifiedPurchasedItems[])
    .flat()
    .reduce((accum, curVal) => {
      if (packsUpfrontIds.includes(curVal.Id)) {
        monthPacksUpfront += 1;
        return [...accum, curVal.clientId];
      } else {
        return accum;
      }
    }, [] as string[]);

  return { monthPacksUpfront, monthPacksUpfrontIds };
};
