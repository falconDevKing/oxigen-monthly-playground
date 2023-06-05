import moment from "moment";
import fs from "fs/promises";
import { v4 as uuidv4 } from "uuid";
import * as dotenv from "dotenv";
dotenv.config();

//api imports
import { createS3Files, putItem, queryTable } from "./helpers/dynamoDB";
import { deleteTempFiles } from "helpers/helpers";
import getBearerToken from "./helpers/getAuthToken";
import fetchSales from "./api/fetchSales";
import fetchClients from "./api/fetchClients";
import fetchClasses from "./api/fetchClasses";
import fetchServices from "./api/fetchServices";
import fetchClassVisits from "./api/fetchClassVisits";
import fetchClientVisits from "./api/fetchClientVisits";
import fetchCompleteClientInfo from "./api/fetchCompleteClientInfo";
import fetchActiveClientMemberships from "./api/fetchActiveClientMemberships";
import fetchActiveClientsMemberships from "./api/fetchActiveClientsMemberships";
import fetchAppointments from "./api/fetchAppointments";
import promiseAllSettledWrapper from "./helpers/promiseAllSettledFulfiller";
// import fetchClientContracts from "./api/fetchClientContracts";

//test data import
// import tClients from "./checks/clients.json";
// import tExtraData from "./checks/extraData.json";
// import tClients from "./sampleData/latestClientData.json";
// import tExtraData from "./sampleData/extraInfoClientDataMay1week.json";
// import tTransactions from "./sampleData/newtransactions.json";
// import monthLeadsContracts from "./checks/monthLeadsContracts.json";
// import monthTrialPurcahsersWithFirstVisitIdsContracts from "./checks/monthTrialPurcahsersWithFirstVisitIdsContracts.json";
// const {
//   services: tServices,
//   sales: tSales,
//   weekClasses: tWeekClasses,
//   weekClassesVisits: tWeekClassesVisits,
//   activeLeadsIds: tActiveLeadsIds,
//   activeLeadsClientsMemberships: tActiveLeadsClientsMemberships,
//   monthTrialsToVisits: tMonthTrialsToVisits,
//   terminatedMembersIds: tTerminatedMembersIds,
//   monthBilledLeadsIds: tMonthBilledLeadsIds,
//   monthPacksUpfrontLeadsIds: tMonthPacksUpfrontLeadsIds,
//   monthTrialPurcahsersWithFirstVisitIds: tMonthTrialPurcahsersWithFirstVisitIds,
//   monthTrialPurcahsersWithVisitToBilledIds: tMonthTrialPurcahsersWithVisitToBilledIds,
//   accountBalanceDebtorsIds: tAccountBalanceDebtorsIds,
//   monthLeadsCompleteClients: tMonthLeadsCompleteClients,
//   monthTrialPurcahsersWithFirstVisitIdsCompleteClients: tMonthTrialPurcahsersWithFirstVisitIdsCompleteClients,
// } = tExtraData;

//types import
import classes, { Appointments, staffData } from "./types/classes";
import services from "./types/services";
import clientType from "./types/clientType";
import { activeClientsMemberships } from "./types/membership";
import visitType, { activeLeadsClientInfoParams } from "./types/visit";
import salesType, { PurchasedItems, modifiedPurchasedItems } from "./types/sales";
import completeClientInfo from "./types/completeClientInfo";

//services imports
import {
  monthTrialsPurcahsersWithVisitToBilledAnalysis,
  monthTrialsPurchasedAnalysis,
  salesByServicesAnalysis,
  trialsFirstVisitAnalysis,
} from "./services/trials";
import { visitAnalysis } from "./services/visits";
import { incomeAnalysis } from "./services/income";
import { staffPerformanceAnalysis } from "./services/staffPerformance";
import { nonCancelledClassesIdsGenerator } from "././services/classes";
import { activeLeadsIdsCreator, groupIdsCreator } from "./services/clients";
import { introServicesIdsCreator, packsUpfrontIdsCreator } from "./services/services";
import { membershipAnalysis, monthlyCancellationsAnalysis } from "./services/membership";
import { leadsPurchasedNothingAnalysis, monthLeadsAnalysis, monthLeadsBilledAnalysis, monthLeadsPacksUpfrontAnalysis } from "./services/leads";

const t0 = performance.now();

//createWriterFunction ---> 1
const writeFiler = async (path: string, data: any) => {
  await fs.writeFile(path, JSON.stringify(data));
  console.log(path, " written");
};

//generate dates -> 2
const formatString = "YYYY-MM-DDTHH:mm:ss[Z]";
const previousReportDate = moment().startOf("month").subtract(2, "months").format(formatString);
const previousMonthBegin = moment().startOf("month").subtract(1, "months").format(formatString);
const monthBegin = moment().startOf("month").format(formatString);

console.log("t", monthBegin, previousMonthBegin, previousReportDate);

//Determine Filter Dates -> 3
const upperSalesDate = previousMonthBegin;
const upperFilterDate = previousMonthBegin;
console.log("upperSalesDate", upperSalesDate, upperFilterDate);

const getMonthReport = async () => {
  try {
    ////get bearer token --> 4
    const authToken = await getBearerToken();
    console.log("token gotten");

    ////Fetch all clients -> 5
    const clientsData: clientType[] = await fetchClients(authToken);
    console.log("clients gotten");

    //Fetch all services -> 6
    const services: services[] = await fetchServices(authToken);
    console.log("services gotten");

    //Fetch all sales -> 7 -> upperDate,weekBegin
    const sales: salesType[] = await fetchSales(authToken, previousMonthBegin, monthBegin);
    console.log("sales gotten");

    //fecth week classes --> 8
    const monthClasses: classes[] = await fetchClasses(authToken, previousMonthBegin, monthBegin);
    console.log("monthClass gotten", monthClasses.length);

    // get noncancelld class Ids --> 9
    const nonCancelledClassesIds = nonCancelledClassesIdsGenerator(monthClasses, authToken);

    // fectch class visits --> 10
    const monthClassesVisitsArray: visitType[][] = await promiseAllSettledWrapper(nonCancelledClassesIds, fetchClassVisits, 2);
    const monthClassesVisits = monthClassesVisitsArray.flat();
    console.log("monthClassVisits gotten", monthClassesVisits.length);

    //fetchAppointments
    const staffAppointments: Appointments[] = await fetchAppointments(authToken, previousMonthBegin, monthBegin);
    console.log("staffAppointments gotten", staffAppointments.length);

    //filter for leads and active clients ids -> 19
    const activeLeadsIds = activeLeadsIdsCreator(clientsData, previousMonthBegin, monthBegin);

    //GET clients Complete info for active and leads -> 20
    ////////    const groupedIds = groupIdsCreator(activeLeadsIds, authToken);
    const groupedIdsInterim = activeLeadsIds.map((activeLeadsId) => ({
      authToken,
      clientId: activeLeadsId,
    }));

    ////////    const activeLeadsClientsMembershipsArray: activeClientsMemberships[][] = await promiseAllSettledWrapper(groupedIdsInterim, fetchActiveClientsMemberships, 2);
    const activeLeadsClientsMembershipsArray: activeClientsMemberships[] = await promiseAllSettledWrapper(groupedIdsInterim, fetchActiveClientMemberships, 2);
    const activeLeadsClientsMemberships = activeLeadsClientsMembershipsArray.flat();
    console.log("activeclients gotten", activeLeadsClientsMemberships.length);

    //Filter services for intro  offers ids -> 11
    const introServicesIds = introServicesIdsCreator(services);

    //get packs and upfront services id -> 18
    const packsUpfrontIds = packsUpfrontIdsCreator(services);

    //GET NEW LEADS FOR THE MONTHS count and store thier ids [weekLeadsIds] ---> 15,F
    const { monthLeadsCount, monthLeadsIds, monthLeadsTrialsCount } = monthLeadsAnalysis(clientsData, sales, introServicesIds, previousMonthBegin, monthBegin);

    //get month trials percent ---> 17,H
    const percentMonthLeadToTrial = Number((monthLeadsTrialsCount / monthLeadsCount) * 100).toFixed(2);

    // get monthly billed leads Ids --> 21
    // get monthly billed leads --> 22,I
    const monthLeadsCompleteClientsParams = monthLeadsIds.map((monthLead) => ({
      authToken,
      clientId: monthLead,
      startDate: previousMonthBegin,
      endDate: monthBegin,
    }));
    const monthLeadsCompleteClients: completeClientInfo[] = await promiseAllSettledWrapper(monthLeadsCompleteClientsParams, fetchCompleteClientInfo, 2);
    console.log("monthLeadsContracts gotten");

    // get monthly billed leads Ids --> 21
    // get monthly billed leads --> 22,I
    const { monthBilledLeads, monthBilledLeadsIds } = monthLeadsBilledAnalysis(monthLeadsCompleteClients);

    // get monthly billed leads percent --> 23,J
    const percentMonthBilledLeads = Number((monthBilledLeads / monthLeadsCount) * 100).toFixed(2);

    //get packs and upfront leads --> 24,K
    const { monthPacksUpfrontLeads, monthPacksUpfrontLeadsIds } = monthLeadsPacksUpfrontAnalysis(
      monthLeadsIds,
      sales,
      packsUpfrontIds,
      previousMonthBegin,
      monthBegin
    );

    //get packs and upfront leads percent--> 25,L
    const percentMonthPacksUpfrontLeads = Number((monthPacksUpfrontLeads / monthLeadsCount) * 100).toFixed(2);

    ///get leads purchased nothing --> 26,M
    const { leadsPurchasedIds, leadPurchasedNothing } = leadsPurchasedNothingAnalysis(sales, monthLeadsIds, monthBilledLeadsIds);

    //get trials purchased --> 27, N
    //get trials purchasers ids --> 28
    const { monthTrialsPurchased, monthTrialsPurchasersIds, monthTrialsPurchasersIdsParams } = monthTrialsPurchasedAnalysis(
      sales,
      introServicesIds,
      authToken,
      previousMonthBegin,
      monthBegin
    );

    //fetch trial purcahsers Visits --> 29
    const monthTrialsToVisits: visitType[][] = await promiseAllSettledWrapper(monthTrialsPurchasersIdsParams, fetchClientVisits, 2);
    console.log("month trial to visits gotten", monthTrialsToVisits.length);

    // get trials first visits for month ---> 30,O
    // get trials first visits for month Ids ---> 31
    const { monthTrialsToFirstVisited, monthTrialPurcahsersWithFirstVisitIds, monthTrialPurcahsersWithFirstVisitIdsParams } = trialsFirstVisitAnalysis(
      clientsData,
      monthTrialsToVisits,
      monthTrialsPurchasersIds,
      authToken,
      previousMonthBegin,
      monthBegin
    );

    // get trials first visits percent ---> 32,P
    const percentMonthTDTrialsToVisit = Number((monthTrialsToFirstVisited / monthTrialsPurchased) * 100).toFixed(2);

    // get trials purchasers with visits to billed members -> 33, Q
    const monthTrialPurcahsersWithFirstVisitIdsCompleteClients: completeClientInfo[] = await promiseAllSettledWrapper(
      monthTrialPurcahsersWithFirstVisitIdsParams,
      fetchCompleteClientInfo,
      2
    );
    console.log("monthTrialPurcahsersWithFirstVisitIdsCompleteClients gotten");

    const { monthTrialPurcahsersWithVisitToBilled, monthTrialPurcahsersWithVisitToBilledIds } = monthTrialsPurcahsersWithVisitToBilledAnalysis(
      monthTrialPurcahsersWithFirstVisitIdsCompleteClients
    );

    // get trials purchasers with visits to billed members percent -> 34, R
    const percentMonthTDTrialsWithVisitToBilled = Number((monthTrialPurcahsersWithVisitToBilled / monthTrialsToFirstVisited) * 100).toFixed(2);

    // get packs and upfront for month ---> 35,S
    const { monthPacksUpfront, monthPacksUpfrontIds } = salesByServicesAnalysis(sales, packsUpfrontIds, previousMonthBegin, monthBegin);

    // const accountBalanceIds: string[] = [];
    const {
      membershipValues,
      activeBilled,
      totalBilled,
      suspendedMembersIds,
      declinedMembersIds,
      terminatedMembersIds,
      limitedMembersIds,
      unlimitedMembersIds,
      challengeMembersIds,
      compMembersIds,
      classPacksMembersIds,
      paidInFullMembersIds,
    } = membershipAnalysis(clientsData, activeLeadsIds, activeLeadsClientsMemberships);

    // get week sales and sales by category ---> 44, AG, AH
    const { totalMonthlyBilledIncome, totalMonthlyIncome, accountBalance, accountBalanceDebtorsIds } = incomeAnalysis(
      clientsData,
      sales,
      previousMonthBegin,
      monthBegin
    );

    //get average billing per member 47, AK
    const averageBillingPerMember = Number(totalMonthlyIncome / activeBilled).toFixed(2);

    // get clients visits 48, AL
    // get clients missed Visits 49, AM
    //get clients unpaid visits 50, AN
    const { attendance, missedVisits, unpaidVisits, missedVisitsArray, unpaidVisitsArray } = visitAnalysis(monthClassesVisits, previousMonthBegin, monthBegin);

    const { staffClasses, staffsPerormance } = staffPerformanceAnalysis(monthClasses, monthClassesVisits, staffAppointments, previousMonthBegin, monthBegin);

    //get previous total billed members, terminations and totalWeeklySales  -> 41
    const previousMonthResults = await queryTable(previousReportDate);
    const sortedMonthResults = previousMonthResults
      ?.filter((res) => res?.reportType === "month")
      .sort((a, b) => {
        const aDate = moment(a?.updatedAt);
        const bDate = moment(b?.updatedAt);

        return aDate === bDate ? 0 : aDate > bDate ? -1 : 1;
      });
    const previousMonthResult = (sortedMonthResults as any[])[0];
    console.log("PWR gotten");

    const { limited, unlimited, challenge, complimentary, paidInFull, classPass, suspended, declined, terminated, ...rest } = membershipValues;

    const { monthlyCancellations, monthlyCancellationsIDs } = await monthlyCancellationsAnalysis(
      previousReportDate + " month extraInfoClientData.json",
      terminatedMembersIds
    );

    //get billed members growth and termination growth -> 42, AD,AE
    //gt attrition rate -> 43, AF
    //get totalWeeklysales growth -> 45, AI
    const data = {
      id: uuidv4(),
      reportType: "month",
      reportWeek: previousMonthBegin,
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
      billedMemberGrowth: totalBilled - (previousMonthResult?.totalBilled ?? 0),
      monthlyCancellations: monthlyCancellations,
      attritionRate: Number((monthlyCancellations * 100) / totalBilled).toFixed(2),
      totalMonthlyBilledIncome,
      totalMonthlyIncome,
      monthlyIncomeGrowth: totalMonthlyIncome - (previousMonthResult?.totalMonthlyIncome ?? 0),
      accountBalanceOwing: accountBalance,
      averageBillingPerMember,
      classesCount: nonCancelledClassesIds.length,
      attendance: attendance,
      noShowCancel: missedVisits,
      unpaidVisits,
      terminated,
      staffsPerormance,
      ...rest,
      updatedAt: moment().format(formatString),
      expireAt: moment().add(13, "months").unix(),
    };

    console.log(data);

    await putItem(data);
    console.log("ddb gotten");

    const organisedData = {
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
        billedMembergrowth: totalBilled - (previousMonthResult?.totalBilled ?? 0),
        monthlyCancellations: monthlyCancellations,
        attritionRate: Number((monthlyCancellations * 100) / totalBilled).toFixed(2),
      },
      sales: {
        monthlyBilledIncome: totalMonthlyBilledIncome,
        totalMonthlyIncome: totalMonthlyIncome,
        monthlyIncomeGrowth: totalMonthlyIncome - (previousMonthResult?.totalMonthlyIncome ?? 0),
      },
      balances: {
        accountBalanceAccruals: accountBalance,
        averageBillingPerMember,
      },
      visits: {
        classesCount: nonCancelledClassesIds.length,
        attendance: attendance,
        noShowLateCancels: missedVisits,
        unpaidVisits,
      },
      staffsPerormance,
    };

    const extraData = {
      results: data,
      organisedData,
      services,
      sales,
      monthClasses,
      monthClassesVisits,
      monthLeadsIds,
      activeLeadsIds,
      activeLeadsClientsMemberships,
      monthTrialsToVisits,
      monthlyCancellationsIDs,
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
      missedVisitsArray,
      unpaidVisitsArray,
      nonCancelledClassesIds,
      leadsPurchasedIds,
      monthLeadsCompleteClients,
      monthTrialPurcahsersWithFirstVisitIdsCompleteClients,
      staffClasses,
      staffAppointments,
      staffsPerormance,
      limitedMembersIds,
      unlimitedMembersIds,
      challengeMembersIds,
      compMembersIds,
      classPacksMembersIds,
      paidInFullMembersIds,
    };

    await writeFiler("./src/checks/clients.json", clientsData);
    await writeFiler("./src/checks/extraData.json", extraData);

    await createS3Files("monthLatestClientData.json", "./src/checks/clients.json");
    await createS3Files(previousMonthBegin + " month extraInfoClientData.json", "./src/checks/extraData.json");

    // await deleteTempFiles("./src/checks/clients.json");
    // await deleteTempFiles("./src/checks/extraData.json");

    const t1 = performance.now();
    console.log("diff", t1 - t0);
  } catch (error) {
    console.log("err", error);
  }
};

// getMonthReport();

// const tester = async () => {
//   // const accountBalanceIds: string[] = [];
//   const {
//     membershipValues,
//     activeBilled,
//     totalBilled,
//     suspendedMembersIds,
//     declinedMembersIds,
//     terminatedMembersIds,
//     unlimitedMembersIds,
//     limitedMembersIds,
//     classPacksMembersIds,
//     compMembersIds,
//     challengeMembersIds,
//     paidInFullMembersIds,
//   } = membershipAnalysis(tClientsData as clientType[], tActiveLeadsIds, tActiveLeadsClientsMemberships);

//   console.log(classPacksMembersIds);
// };

// tester();
