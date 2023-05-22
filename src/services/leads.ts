import moment from "moment";
import clientType from "../types/clientType";
import { modifyDate } from "../helpers/helpers";
import salesType, { PurchasedItems, modifiedPurchasedItems } from "../types/sales";
import completeClientInfo from "../types/completeClientInfo";

export const weekLeadsAnalysis = (clientsData: clientType[], sales: salesType[], introServicesIds: number[], previousWeekBegin: string, weekBegin: string) => {
  //Filter clients for new weeks leads count and store thier ids [weekLeadsIds] -> 12,C
  let weekLeadsCount = 0;
  const weekLeadsIds = clientsData?.reduce((accumulator, currentValue) => {
    const modFilterDate = modifyDate(currentValue?.CreationDate);
    const weekLead = moment(modFilterDate).isSameOrAfter(previousWeekBegin, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour");

    if (weekLead) {
      weekLeadsCount += 1;
      return [...accumulator, currentValue.Id];
    } else {
      return accumulator;
    }
  }, [] as string[]);

  //get week trials ---> 13,D
  const weekLeadsTrialsCount = weekLeadsIds.reduce((accumulator, currentVal) => {
    const leadPurchasedItems = sales
      .reduce((acc, curr) => {
        if (
          curr.ClientId === currentVal &&
          moment(curr.SaleDateTime).isSameOrAfter(previousWeekBegin, "hour") &&
          moment(weekBegin).isAfter(curr.SaleDateTime, "hour")
        ) {
          return [...acc, curr.PurchasedItems];
        }
        return acc;
      }, [] as PurchasedItems[][])
      .flat();

    const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => introServicesIds.includes(leadPurchasedItem.Id));
    const leadTrial = leadSaleItemsTrial.includes(true);

    if (leadTrial) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);

  return { weekLeadsCount, weekLeadsIds, weekLeadsTrialsCount };
};

export const monthLeadsAnalysis = (clientsData: clientType[], sales: salesType[], introServicesIds: number[], upperFilterDate: string, weekBegin: string) => {
  //GET NEW LEADS FOR THE MONTHS count and store thier ids [weekLeadsIds] ---> 15,F
  let monthLeadsCount = 0;
  const monthLeadsIds: string[] = clientsData?.reduce((accumulator, client) => {
    const modFilterDate = modifyDate(client?.CreationDate);
    const monthLead = moment(modFilterDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour");
    if (monthLead) {
      monthLeadsCount += 1;
      return [...accumulator, client.Id];
    } else {
      return accumulator;
    }
  }, [] as string[]);

  //get month trials alt ---> 16,G
  const monthLeadsTrialsCount = monthLeadsIds.reduce((accumulator, currentVal) => {
    const leadPurchasedItems = sales
      .reduce((acc, curr) => {
        const modFilterDate = modifyDate(curr.SaleDateTime);
        if (curr.ClientId === currentVal && moment(modFilterDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour")) {
          return [...acc, curr.PurchasedItems];
        }
        return acc;
      }, [] as PurchasedItems[][])
      .flat();

    const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => introServicesIds.includes(leadPurchasedItem.Id));
    const leadTrial = leadSaleItemsTrial.includes(true);

    if (leadTrial) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);

  return { monthLeadsCount, monthLeadsIds, monthLeadsTrialsCount };
};

export const monthLeadsBilledAnalysis = (monthLeadsCompleteClients: completeClientInfo[]) => {
  let monthBilledLeads = 0;
  const monthBilledLeadsIds = monthLeadsCompleteClients.reduce((accumulator, currentValue) => {
    if (currentValue.ClientContracts.length) {
      monthBilledLeads += 1;
      return [...accumulator, currentValue.Client.Id];
    }
    return accumulator;
  }, [] as string[]);

  return { monthBilledLeads, monthBilledLeadsIds };
};

export const monthLeadsPacksUpfrontAnalysis = (
  monthLeadsIds: string[],
  sales: salesType[],
  packsUpfrontIds: number[],
  upperFilterDate: string,
  weekBegin: string
) => {
  //get packs and upfront leads --> 24,K
  let monthPacksUpfrontLeads = 0;
  const monthPacksUpfrontLeadsIds = monthLeadsIds.reduce((accumulator, currentVal) => {
    const leadPurchasedItems = sales
      .reduce((acc, curr) => {
        const modFilterDate = modifyDate(curr.SaleDateTime);
        if (curr.ClientId === currentVal && moment(modFilterDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour")) {
          return [...acc, curr.PurchasedItems];
        }
        return acc;
      }, [] as PurchasedItems[][])
      .flat();

    const leadSaleItemsPacksUpfront = leadPurchasedItems.map((leadPurchasedItem) => packsUpfrontIds.includes(leadPurchasedItem.Id));
    const leadPacksUpfront = leadSaleItemsPacksUpfront.includes(true);

    if (leadPacksUpfront) {
      monthPacksUpfrontLeads += 1;
      return [...accumulator, currentVal];
    } else {
      return accumulator;
    }
  }, [] as string[]);

  return { monthPacksUpfrontLeads, monthPacksUpfrontLeadsIds };
};

export const leadsPurchasedNothingAnalysis = (sales: salesType[], monthLeadsIds: string[], monthBilledLeadsIds: string[]) => {
  const leadsPurchasedIds = Array.from(new Set([...sales.map((sale) => sale.ClientId), ...monthBilledLeadsIds]));
  const leadPurchasedNothing = monthLeadsIds.reduce((accumulator, currentValue) => {
    if (!leadsPurchasedIds.includes(currentValue)) {
      return accumulator + 1;
    } else {
      return accumulator;
    }
  }, 0);

  return { leadsPurchasedIds, leadPurchasedNothing };
};
