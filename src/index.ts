import moment from "moment";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

// group membershipsids by groups and import 36, M
import {
  unlimitedBilledIds,
  limitedBilledIds,
  complimentaryIds,
  challengeUpfrontIds,
  paidInFullIds,
  classPassIds,
  inActiveIds,
} from "./sampleData/membershipGroupings";

import { createS3Files, putItem, queryTable } from "./helpers/dynamoDB";
import getBearerToken from "./helpers/getAuthToken";
import fetchSales from "./api/fetchSales";
import fetchClients from "./api/fetchClients";
import fetchClasses from "./api/fetchClasses";
import fetchServices from "./api/fetchServices";
import fetchClassVisits from "./api/fetchClassVisits";
import fetchClientVisits from "./api/fetchClientVisits";
import fetchClientContracts from "./api/fetchClientContracts";
import fetchCompleteClientInfo from "./api/fetchCompleteClientInfo";
import fetchActiveClientMemberships from "./api/fetchActiveClientMemberships";
import promiseAllSettledWrapper from "./helpers/promiseAllSettledFulfiller";

// import clientsData from "./sampleData/clientData.json";
// import services from "./sampleData/services.json";
import tClients from "./sampleData/latestClientData.json";
import tExtraData from "./sampleData/extraInfoClientDataMay1week.json";
import tTransactions from "./sampleData/newtransactions.json";
// import tServices from "./sampleData/services.json";
// import tSales from "./sampleData/sales.json";
// import tWeekClasses from "./sampleData/weekClasses.json";
// import tWeekClassesVisits from "./sampleData/weekClassesVisit.json";
// import tActiveLeadsClientsMemberships from "./sampleData/activeLeadsIdsMemberships.json";
// import tMonthTrialsToVisits from "./sampleData/trialsVisitMth.json";
import monthLeadsContracts from "./checks/monthLeadsContracts.json";
import monthTrialPurcahsersWithFirstVisitIdsContracts from "./checks/monthTrialPurcahsersWithFirstVisitIdsContracts.json";

const {
  services: tServices,
  sales: tSales,
  weekClasses: tWeekClasses,
  weekClassesVisits: tWeekClassesVisits,
  activeLeadsIds: tActiveLeads,
  activeLeadsClientsMemberships: tActiveLeadsClientsMemberships,
  monthTrialsToVisits: tMonthTrialsToVisits,
  terminatedMembersIds: tTerminatedMembersIds,
  monthBilledLeadsIds: tMonthBilledLeadsIds,
  monthPacksUpfrontLeadsIds: tMonthPacksUpfrontLeadsIds,
  monthTrialPurcahsersWithFirstVisitIds: tMonthTrialPurcahsersWithFirstVisitIds,
  monthTrialPurcahsersWithVisitToBilledIds: tMonthTrialPurcahsersWithVisitToBilledIds,
  accountBalanceDebtorsIds: tAccountBalanceDebtorsIds,
} = tExtraData;

// import completeClientsInfo from "./sampleData/completeClient.json";
// import monthTrialsToVisits from "./sampleData/trialsVisitMth.json";
// import activeLeadsVisits from "./sampleData/activeLeadsVisits.json";
// import activeLeadsUnpaidVisits from "./sampleData/activeLeadsUnpaidVisits.json";

import visit from "./types/visit";
import classes from "./types/classes";
import services from "./types/services";
import clientType from "./types/clientType";
import { activeClientsMemberships } from "types/membership";
import visitType, { activeLeadsClientInfoParams } from "./types/visit";
import salesType, { PurchasedItems, modifiedPurchasedItems } from "./types/sales";
import completeClientInfo from "./types/completeClientInfo";

const t0 = performance.now();

//createWriterFunction ---> 1
const writeFiler = async (path: string, data: any) => {
  await fs.writeFile(path, JSON.stringify(data));
  console.log(path, " written");
};

//generate dates -> 2
const formatString = "YYYY-MM-DDTHH:mm:ss[Z]";
const previousMonthBegin = moment().startOf("month").subtract(1, "months").format(formatString);
const previousReportDate = moment().startOf("week").subtract(2, "weeks").add(1, "days").format(formatString);
const previousWeekBegin = moment().startOf("week").subtract(1, "weeks").add(1, "days").format(formatString);
const weekBegin = moment().startOf("week").add(1, "days").format(formatString);
const monthBegin = moment().startOf("month").format(formatString);

console.log("t", monthBegin, previousMonthBegin, weekBegin, previousWeekBegin, previousReportDate);

//Determine Filter Dates -> 3
const upperSalesDate = moment(monthBegin).isSame(moment(), "day")
  ? previousMonthBegin
  : moment(previousWeekBegin).isBefore(monthBegin)
  ? previousWeekBegin
  : monthBegin;
const upperFilterDate = moment(monthBegin).isSame(moment(), "day") ? previousMonthBegin : monthBegin;
console.log("upperSalesDate", upperSalesDate, upperFilterDate);

const getWeekReport = async () => {
  try {
    ////get bearer token --> 4
    const authToken = await getBearerToken();
    // const authToken = "auth";
    console.log("token gotten");

    ////Fetch all clients -> 5
    // const clientsData: clientType[] = await fetchClients(authToken);
    const clientsData = tClients as clientType[];
    console.log("clients gotten");

    //Fetch all services -> 6
    // const services: services[] = await fetchServices(authToken);
    const services = tServices as services[];
    console.log("services gotten");

    //Fetch all sales -> 7 -> upperDate,weekBegin
    // const sales: salesType[] = await fetchSales(authToken, upperSalesDate, weekBegin)
    const sales = tSales as salesType[];
    console.log("sales gotten");

    //fecth week classes --> 8
    // const weekClasses: classes[] = await fetchClasses(authToken, previousWeekBegin, weekBegin);
    const weekClasses = tWeekClasses as unknown as classes[];
    console.log("weekClass gotten", weekClasses.length);
    // get noncancelld class Ids --> 9
    const nonCancelledClassesIds = weekClasses.reduce((accumulator, currentValue) => {
      if (currentValue.IsCanceled) {
        return accumulator;
      }
      return [...accumulator, { authToken, classId: currentValue?.Id }];
    }, [] as { authToken: string; classId: number }[]);

    // fectch class visits --> 10
    // const weekClassesVisitsArray: visitType[][] = await promiseAllSettledWrapper(nonCancelledClassesIds, fetchClassVisits, 2);
    // const weekClassesVisits = weekClassesVisitsArray.flat();
    const weekClassesVisits = tWeekClassesVisits as unknown as visit[];
    console.log("weekClassVisits gotten", weekClassesVisits.length);

    //filter for leads and active clients ids -> 19
    const activeLeadsIds = clientsData.reduce((accumulator, currentValue) => {
      if (
        currentValue.Status === "Active" ||
        (moment(currentValue?.CreationDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(currentValue?.CreationDate, "hour"))
      ) {
        return [...accumulator, currentValue.Id];
      } else {
        return accumulator;
      }
    }, [] as string[]);

    //GET clients Complete info for active and leads -> 20
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

    // const activeLeadsClientsMembershipsArray: activeClientsMemberships[][] = await promiseAllSettledWrapper(groupedIds, fetchActiveClientMemberships, 3);
    // const activeLeadsClientsMemberships = activeLeadsClientsMembershipsArray.flat();
    const activeLeadsClientsMemberships = tActiveLeadsClientsMemberships as unknown as activeClientsMemberships[];
    console.log("activeclients gotten", activeLeadsClientsMemberships.length);

    //Filter services for intro  offers ids -> 11
    const introServicesIds = services?.reduce((accumulator, currentValue) => {
      if (currentValue.IsIntroOffer) {
        return [...accumulator, currentValue.ProductId];
      }
      return accumulator;
    }, [] as number[]);

    //get packs and upfront services id -> 18
    const packsUpfrontIds = (services as any[])?.reduce((accumulator, currentValue) => {
      if (currentValue.MembershipId === 4434 || currentValue.MembershipId === 4435) {
        return [...accumulator, currentValue.ProductId];
      }
      return accumulator;
    }, []);

    //Filter clients for new weeks leads count and store thier ids [weekLeadsIds] -> 12,C
    let weekLeadsCount = 0;
    const weekLeadsIds = clientsData?.reduce((accumulator, currentValue) => {
      const weekLead =
        moment(currentValue?.CreationDate).isSameOrAfter(previousWeekBegin, "hour") && moment(weekBegin).isAfter(currentValue?.CreationDate, "hour");

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

    //get week trials percent ---> 14,E
    const percentWeekLeadToTrial = Number((weekLeadsTrialsCount / weekLeadsCount) * 100).toFixed(2);

    //GET NEW LEADS FOR THE MONTHS count and store thier ids [weekLeadsIds] ---> 15,F
    let monthLeadsCount = 0;
    const monthLeadsIds: string[] = clientsData?.reduce((accumulator, client) => {
      const monthLead = moment(client?.CreationDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(client?.CreationDate, "hour");
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
          if (
            curr.ClientId === currentVal &&
            moment(curr.SaleDateTime).isSameOrAfter(upperFilterDate, "hour") &&
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

    //get month trials percent ---> 17,H
    const percentMonthLeadToTrial = Number((monthLeadsTrialsCount / monthLeadsCount) * 100).toFixed(2);

    // get monthly billed leads Ids --> 21
    // get monthly billed leads --> 22,I
    const monthLeadsCompleteClientsParams = monthLeadsIds.map((monthLead) => ({
      authToken,
      clientId: monthLead,
      startDate: previousWeekBegin,
      endDate: weekBegin,
    }));
    const monthLeadsCompleteClients: completeClientInfo[] = await promiseAllSettledWrapper(monthLeadsCompleteClientsParams, fetchCompleteClientInfo, 2);
    await writeFiler("./src/checks/monthLeadsCompleteClients.json", monthLeadsCompleteClients);
    console.log("monthLeadsContracts gotten");

    let monthBilledLeads = 0;
    const monthBilledLeadsIds = monthLeadsCompleteClients.reduce((accumulator, currentValue) => {
      if (currentValue.ClientContracts.length) {
        monthBilledLeads += 1;
        return [...accumulator, currentValue.Client.Id];
      }
      return accumulator;
    }, [] as string[]);

    // get monthly billed leads percent --> 23,J
    const percentMonthBilledLeads = Number((monthBilledLeads / monthLeadsCount) * 100).toFixed(2);

    //get packs and upfront leads --> 24,K
    let monthPacksUpfrontLeads = 0;
    const monthPacksUpfrontLeadsIds = monthLeadsIds.reduce((accumulator, currentVal) => {
      const leadPurchasedItems = sales
        .reduce((acc, curr) => {
          if (
            curr.ClientId === currentVal &&
            moment(curr.SaleDateTime).isSameOrAfter(upperFilterDate, "hour") &&
            moment(weekBegin).isAfter(curr.SaleDateTime, "hour")
          ) {
            return [...acc, curr.PurchasedItems];
          }
          return acc;
        }, [] as PurchasedItems[][])
        .flat();

      const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => packsUpfrontIds.includes(leadPurchasedItem.Id));
      const leadTrial = leadSaleItemsTrial.includes(true);

      if (leadTrial) {
        monthPacksUpfrontLeads += 1;
        return [...accumulator, currentVal];
      } else {
        return accumulator;
      }
    }, [] as string[]);

    //get packs and upfront leads percent--> 25,L
    const percentMonthPacksUpfrontLeads = Number((monthPacksUpfrontLeads / monthLeadsCount) * 100).toFixed(2);

    ///get leads purchased nothing --> 26,M
    const leadsPurchasedIds = Array.from(new Set([...sales.map((sale) => sale.ClientId), ...monthBilledLeadsIds]));
    const leadPurchasedNothing = monthLeadsIds.reduce((accumulator, currentValue) => {
      if (!leadsPurchasedIds.includes(currentValue)) {
        return accumulator + 1;
      } else {
        return accumulator;
      }
    }, 0);

    //get trials purchased --> 27, N
    //get trials purchasers ids --> 28
    let monthTrialsPurchased = 0;
    const monthTrialsPurchasersIds = sales
      .reduce((accumulator, currentValue) => {
        if (moment(currentValue.SaleDateTime).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(currentValue.SaleDateTime, "hour")) {
          const purchasedItems = currentValue.PurchasedItems;
          const modifiedPurchasedItems: modifiedPurchasedItems[] = purchasedItems.map((purchasedItem) => ({
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

    //fetch trial purcahsers Visits --> 29
    const monthTrialsPurchasersIdsParams = monthTrialsPurchasersIds.reduce((accumulator, currentValue) => {
      return [...accumulator, { clientId: currentValue, authToken, startDate: upperFilterDate, endDate: weekBegin }];
    }, [] as activeLeadsClientInfoParams[]);
    // const monthTrialsToVisits: visit[][] = await promiseAllSettledWrapper(monthTrialsPurchasersIdsParams, fetchClientVisits, 2);
    const monthTrialsToVisits = tMonthTrialsToVisits as visit[][];
    console.log("month trial to visits gotten", monthTrialsToVisits.length);

    // get trials first visits for month ---> 30,O
    // get trials first visits for month Ids ---> 31
    let monthTrialsToFirstVisited = 0;
    const monthTrialPurcahsersWithFirstVisitIds = monthTrialsPurchasersIds.reduce((accum, curVal) => {
      const clientData = (tClients as clientType[]).find((client) => client.Id === curVal);

      if (!clientData) {
        return accum;
      }

      if (moment(clientData?.FirstClassDate).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(clientData?.FirstClassDate, "hour")) {
        monthTrialsToFirstVisited += 1;
        return [...accum, clientData?.Id];
      }

      return accum;
    }, [] as string[]);

    // get trials first visits percent ---> 32,P
    const percentMonthTDTrialsToVisit = Number((monthTrialsToFirstVisited / monthTrialsPurchased) * 100).toFixed(2);

    // get trials purchasers with visits to billed members -> 33, Q

    const monthTrialPurcahsersWithFirstVisitIdsParams = monthTrialPurcahsersWithFirstVisitIds.map((monthTrialPurcahsersWithFirstVisitId) => ({
      authToken,
      clientId: monthTrialPurcahsersWithFirstVisitId,
      startDate: previousWeekBegin,
      endDate: weekBegin,
    }));
    const monthTrialPurcahsersWithFirstVisitIdsCompleteClients: completeClientInfo[] = await promiseAllSettledWrapper(
      monthTrialPurcahsersWithFirstVisitIdsParams,
      fetchCompleteClientInfo,
      2
    );
    await writeFiler("./src/checks/monthTrialPurcahsersWithFirstVisitIdsCompleteClients.json", monthTrialPurcahsersWithFirstVisitIdsCompleteClients);
    console.log("monthTrialPurcahsersWithFirstVisitIdsCompleteClients gotten");

    let monthTrialPurcahsersWithVisitToBilled = 0;
    const monthTrialPurcahsersWithVisitToBilledIds = monthTrialPurcahsersWithFirstVisitIdsCompleteClients.reduce((accumulator, currentValue) => {
      if (currentValue.ClientContracts.length) {
        monthTrialPurcahsersWithVisitToBilled += 1;
        return [...accumulator, currentValue.Client.Id];
      }
      return accumulator;
    }, [] as string[]);

    // get trials purchasers with visits to billed members percent -> 34, R
    const percentMonthTDTrialsWithVisitToBilled = Number((monthTrialPurcahsersWithVisitToBilled / monthTrialsPurchased) * 100).toFixed(2);

    // get packs and upfront for month ---> 35,S
    let monthPacksUpfront = 0;
    const monthPacksUpfrontIds = sales
      .reduce((accumulator, currentValue) => {
        if (moment(currentValue.SaleDateTime).isSameOrAfter(upperFilterDate, "hour") && moment(weekBegin).isAfter(currentValue.SaleDateTime, "hour")) {
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

    // const accountBalanceIds: string[] = [];
    const suspendedMembersIds: string[] = [];
    const declinedMembersIds: string[] = [];
    const terminatedMembersIds: string[] = [];

    // create grouped clients by statuses ---> 37
    // get grouped clients ---> 34, V - AE
    const getGenericFigures = (clients: clientType[]) => {
      let active = 0;
      let declined = 0;
      let expired = 0;
      let suspended = 0;
      let terminated = 0;
      let nonMember = 0;

      clients.forEach((client) => {
        if (client.Status === "Active") {
          active += 1;
        }
        if (client.Status === "Terminated") {
          terminated += 1;
          terminatedMembersIds.push(client.Id);
        }
        if (client.Status === "Expired") {
          expired += 1;
        }
        if (client.Status === "Suspended") {
          suspended += 1;
          suspendedMembersIds.push(client.Id);
        }
        if (client.Status === "Declined") {
          declined += 1;
          declinedMembersIds.push(client.Id);
        }
        if (client.Status === "Non-Member") {
          nonMember += 1;
        }
      });

      return { active, declined, expired, suspended, terminated, nonMember };
    };

    // create grouped clients by memberships ---> 38
    const getMembershipFigures = (clientsData: string[]) => {
      let unlimited = 0;
      let limited = 0;
      let challenge = 0;
      let complimentary = 0;
      let paidInFull = 0;
      let classPass = 0;
      let inActive = 0;

      clientsData.forEach((clientId) => {
        const membershipsIds = activeLeadsClientsMemberships
          .find((activeLeadsClientsMembership) => activeLeadsClientsMembership?.ClientId === clientId)
          ?.Memberships?.map((membership) => membership.MembershipId);

        const uniqueMembershipIds = Array.from(new Set(membershipsIds));

        uniqueMembershipIds?.forEach((membershipId: number) => {
          if (unlimitedBilledIds.includes(membershipId)) {
            unlimited += 1;
          }
          if (limitedBilledIds.includes(membershipId)) {
            limited += 1;
          }
          if (challengeUpfrontIds.includes(membershipId)) {
            challenge += 1;
          }
          if (complimentaryIds.includes(membershipId)) {
            complimentary += 1;
          }
          if (paidInFullIds.includes(membershipId)) {
            paidInFull += 1;
          }
          if (classPassIds.includes(membershipId)) {
            classPass += 1;
          }
          if (inActiveIds.includes(membershipId)) {
            inActive += 1;
          }
        });
      });

      return { unlimited, limited, challenge, complimentary, paidInFull, classPass, inActive };
    };
    // exceute client grouping function and combined --> 39
    const genericMembershipFigures = getGenericFigures(clientsData);
    const membershipFigures = getMembershipFigures(activeLeadsIds);

    const membershipValues = Object.assign(genericMembershipFigures, membershipFigures);

    // get totalBilled and active billed --> 40,T,U
    const activeBilled = membershipValues.unlimited + membershipValues.limited + membershipValues.declined;
    const totalBilled = activeBilled + membershipValues.suspended;

    // get week sales and sales by category ---> 44, AG, AH
    let totalWeeklyBilledIncome = 0;
    let totalWeeklyIncome = 0;
    (sales as any[])?.forEach((sale: any) => {
      const considerableSale = moment(sale.SaleDateTime).isSameOrAfter(previousWeekBegin, "hour") && moment(weekBegin).isAfter(sale.SaleDateTime, "hour");
      if (considerableSale) {
        const purchasedItems = sale.PurchasedItems.forEach((purchasedItem: any) => {
          if (sale.Payments[0].TransactionId) {
            totalWeeklyIncome = totalWeeklyIncome + purchasedItem.TotalAmount;
            if (purchasedItem.ContractId) {
              totalWeeklyBilledIncome = totalWeeklyBilledIncome + purchasedItem.TotalAmount;
            }
          }
        });
      }
    });

    let accountBalance = 0;
    const accountBalanceDebtorsIds = clientsData.reduce((accumulator, currentValue) => {
      if (
        currentValue?.AccountBalance &&
        currentValue?.AccountBalance < 0 &&
        currentValue?.Id !== "100005814" &&
        currentValue?.Status !== "Non-Member" &&
        currentValue?.Status !== "Declined" &&
        currentValue?.Status !== "Terminated"
      ) {
        accountBalance += currentValue?.AccountBalance;
        return [...accumulator, { clientId: currentValue?.Id, debt: currentValue?.AccountBalance, status: currentValue?.Status }];
      }

      return accumulator;
    }, [] as { clientId: string; debt: number; status: string }[]);

    //get average billing per member 47, AK
    const averageBillingPerMember = Number(totalWeeklyIncome / activeBilled).toFixed(2);

    // get clients visits 48, AL
    // get clients missed Visits 49, AM
    //get clients unpaid visits 50, AN
    let missedVisits = 0;
    let unpaidVisits = 0;
    let missedVisitsArray: string[] = [];
    let unpaidVisitsArray: string[] = [];
    const attendance = tWeekClassesVisits.reduce((accumulator, currentValue) => {
      if (moment(currentValue.StartDateTime).isAfter(previousWeekBegin)) {
        if (currentValue.Missed) {
          missedVisits += 1;
          missedVisitsArray = [...missedVisitsArray, currentValue.ClientId];
          return accumulator;
        }
        if (!currentValue.Missed && (!currentValue.ServiceId || !currentValue.ProductId)) {
          unpaidVisits += 1;
          unpaidVisitsArray = [...unpaidVisitsArray, currentValue.ClientId];
        }
        return accumulator + 1;
      }
      return accumulator;
    }, 0);

    //get previous total billed members, terminations and totalWeeklySales  -> 41
    const previousWeekResults = await queryTable(previousReportDate);
    const previousWeekResult = (previousWeekResults as any[])[0];
    console.log("PWR", previousWeekResult);

    const { limited, unlimited, challenge, complimentary, paidInFull, classPass, suspended, declined, terminated, ...rest } = membershipValues;

    //get billed members growth and termination growth -> 42, AD,AE
    //gt attrition rate -> 43, AF
    //get totalWeeklysales growth -> 45, AI
    const data = {
      id: uuidv4(),
      reportWeek: previousWeekBegin,
      newWeekLeadsCount: weekLeadsCount,
      newWeekLeadsTrials: weekLeadsTrialsCount,
      percentWeekLeadToTrial,
      monthTDLeads: monthLeadsCount,
      monthTDLeadsTrials: monthLeadsTrialsCount,
      percentMonthLeadToTrial,
      monthTDBilledleads: monthBilledLeads,
      percentMonthBilledLeads,
      monthTDPacksUpfrontleads: monthPacksUpfrontLeads,
      percentMonthPacksUpfrontLeads,
      monthTDLeadPurchasedNothing: leadPurchasedNothing,
      monthTDTrialsPurchasaed: monthTrialsPurchased,
      monthTDTrialsToVisit: monthTrialsToFirstVisited,
      percentMonthTDTrialsToVisit,
      monthTDTrialsWithVisitToBilled: monthTrialPurcahsersWithVisitToBilled,
      percentMonthTDTrialsWithVisitToBilled,
      monthTDPacksUpfront: monthPacksUpfront,
      totalBilled,
      activeBilled,
      limitedBilled: limited,
      unlimitedBilled: unlimited,
      challengeUpfront: challenge,
      complimentary: complimentary,
      paidInFull: paidInFull,
      classPasses: classPass,
      Suspended: suspended,
      declined: declined,
      billedMemberGrowth: totalBilled - previousWeekResult.totalBilled,
      weeklyCancellations: terminated - previousWeekResult.terminated,
      attritionRate: Number(((terminated - previousWeekResult.terminated) * 100) / totalBilled).toFixed(2),
      totalWeeklyBilledIncome,
      totalWeeklyIncome,
      weeklyIncomeGrowth: totalWeeklyIncome - previousWeekResult.totalWeeklyIncome,
      accountBalanceOwing: accountBalance,
      averageBillingPerMember,
      weekAttendance: attendance,
      noShowCancel: missedVisits,
      unpaidVisits,
      terminated,
      ...rest,
      updatedAt: moment().format(formatString),
      expireAt: moment().add(13, "months").unix(),
    };

    console.log(data);

    await putItem(data);
    console.log("ddb gotten");

    console.log("dm", declinedMembersIds, declined);
    console.log("sm", suspendedMembersIds, suspended);

    const organisedData = {
      weekLeads: {
        newLeadsForTheWeek: weekLeadsCount,
        newLeadsOnTrialForTheWeek: weekLeadsTrialsCount,
        percentLeadToTrialsWeek: percentWeekLeadToTrial,
      },
      monthLeads: {
        newLeadsForTheMonth: monthLeadsCount,
        newLeadsOnTrialForTheMonth: monthLeadsTrialsCount,
        percentLeadToTrialsMonth: percentMonthLeadToTrial,
        leadsToBilledSalesMTD: monthBilledLeads,
        percentLeadsToBilledSalesMTD: percentMonthBilledLeads,
        leadsToPacksUpfrontMTD: monthPacksUpfrontLeads,
        percentLeadsToPacksUpfrontMTD: percentMonthPacksUpfrontLeads,
        leadsPurchasedNothingMTD: leadPurchasedNothing,
      },
      trialsPerfomance: {
        trialsPurchasedMonth: monthTrialsPurchased,
        trialsPurchasedToFirstVisitMTD: monthTrialsToFirstVisited,
        percentTrialsToFirstVisitMTD: percentMonthTDTrialsToVisit,
        trialsFirstVisitToBilledMTD: monthTrialPurcahsersWithVisitToBilled,
        percentTrialsFirstVisitToBilledMTD: percentMonthTDTrialsWithVisitToBilled,
      },
      packsUpfrontSoldMTD: monthPacksUpfront,
      membership: {
        totalBilled: totalBilled,
        totalActiveBilled: activeBilled,
        limitedBilled: limited,
        unlimitedBilled: unlimited,
        challengeUpfront: challenge,
        complimentary: complimentary,
        paidInFull: paidInFull,
        classPasses: classPass,
        suspended: suspended,
        declined: declined,
        billedMembergrowth: totalBilled - previousWeekResult.totalBilled,
        weeklyCancellations: terminated - previousWeekResult.terminated,
        attritionRate: Number(((terminated - previousWeekResult.terminated) * 100) / totalBilled).toFixed(2),
      },
      sales: {
        weeklyBilledIncome: totalWeeklyBilledIncome,
        totalWeeklyIncome: totalWeeklyIncome,
        weeklyIncomeGrowth: totalWeeklyIncome - previousWeekResult.totalWeeklyIncome,
      },
      balances: {
        accountBalanceAccruals: accountBalance,
        averageBillingPerMember,
      },
      visits: {
        attendance: attendance,
        noShowLateCancels: missedVisits,
        unpaidVisits,
      },
    };

    const extraData = {
      results: data,
      organisedData,
      services,
      sales,
      weekClasses,
      weekClassesVisits,
      activeLeadsIds,
      activeLeadsClientsMemberships,
      monthTrialsToVisits,
      terminatedMembersIds,
      suspendedMembersIds,
      declinedMembersIds,
      monthBilledLeadsIds,
      monthPacksUpfrontLeadsIds,
      monthTrialsPurchasersIds,
      monthTrialPurcahsersWithFirstVisitIds,
      monthTrialPurcahsersWithVisitToBilledIds,
      monthPacksUpfrontIds,
      accountBalanceDebtorsIds,
      monthLeadsContracts,
      monthTrialPurcahsersWithFirstVisitIdsContracts,
    };

    await writeFiler("./src/checks/clients.json", clientsData);
    await writeFiler("./src/checks/extraData.json", extraData);

    // await createS3Files("latestClientData.json", "./src/checks/clients.json");
    // await createS3Files(previousWeekBegin + " extraInfoClientData.json", "./src/checks/extraData.json");

    const t1 = performance.now();
    console.log("diff", t1 - t0);
  } catch (error) {
    console.log("err", error);
  }
};

const tester = () => {
  let accountBalance = 0;
  const accountBalanceDebtorsIds = (tClients as clientType[]).reduce((accumulator, currentValue) => {
    if (
      currentValue?.AccountBalance &&
      currentValue?.AccountBalance < 0 &&
      currentValue?.Id !== "100005814" &&
      currentValue?.Status !== "Non-Member" &&
      currentValue?.Status !== "Terminated"
    ) {
      accountBalance += currentValue?.AccountBalance;
      return [...accumulator, { clientId: currentValue?.Id, debt: currentValue?.AccountBalance, status: currentValue?.Status }];
    }

    return accumulator;
  }, [] as { clientId: string; debt: number; status: string }[]);

  console.log(accountBalance);
};

tester();

// getWeekReport();
