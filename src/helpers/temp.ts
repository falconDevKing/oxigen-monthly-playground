import clientsData from "../sampleData/clientData.json";
import moment from "moment";
import fs from "fs/promises";

const t0 = performance.now();
let activeClients = 0;
let expired = 0;
let declined = 0;
let suspended = 0;
let terminated = 0;
let leads = 0;
let coonsiderableDataCount = 0;
let newMonthPrevleadsCount = 0;
let newMonthleadsCount = 0;
let previousWeekleadsCount = 0;
let newWeekleadsCount = 0;
let considerableleadsData: any[] = [];

const formatString = "YYYY-MM-DDTHH:mm:ss[Z]";
const init = moment().startOf("week").format(formatString);
const monthWeekBegin = moment().startOf("month").startOf("week").format(formatString);
const monthBegin = moment().startOf("month").format(formatString);
const twoPreviousWeekBegin = moment().startOf("week").subtract(3, "weeks").format(formatString);
const previousWeekBegin = moment().startOf("week").subtract(2, "weeks").format(formatString);
const weekBegin = moment().startOf("week").subtract(1, "weeks").format(formatString);

console.log(monthWeekBegin, monthBegin, previousWeekBegin, weekBegin);
const clientsFiltering = (clientsData as any[])?.forEach((client: any) => {
  const considerableLead = moment(client?.CreationDate).isBetween(monthWeekBegin, weekBegin, "day", "(]");
  const newMonthPrevLeads = moment(client?.CreationDate).isBetween(monthBegin, previousWeekBegin, "day", "[]");
  const newMonthLeads = moment(client?.CreationDate).isBetween(monthBegin, weekBegin, "day", "[]");
  const previousWeekLeads = moment(client?.CreationDate).isBetween(twoPreviousWeekBegin, previousWeekBegin, "day", "(]");
  const newWeekLeads = moment(client?.CreationDate).isBetween(previousWeekBegin, weekBegin, "day", "(]");

  if (client.Status === "Active") {
    activeClients += 1;
  }
  if (client.Status === "Terminated") {
    terminated += 1;
  }
  if (client.Status === "Expired") {
    expired += 1;
  }
  if (client.Status === "Suspended") {
    suspended += 1;
  }
  if (client.Status === "Declined") {
    declined += 1;
  }
  if (client.Status === "Non-Member") {
    leads += 1;
  }
  if (newMonthLeads || client.Status === "Active") {
    coonsiderableDataCount += 1;
    considerableleadsData.push(client);
  }
  if (newMonthPrevLeads) {
    newMonthPrevleadsCount += 1;
    // newleadsData.push(client);
  }
  if (newMonthLeads) {
    newMonthleadsCount += 1;
    // newleadsData.push(client);
  }
  if (previousWeekLeads) {
    previousWeekleadsCount += 1;
    // newleadsData.push(client);
  }
  if (newWeekLeads) {
    newWeekleadsCount += 1;
    // newleadsData.push(client);
  }
});
const t1 = performance.now();

console.log({
  activeClients,
  declined,
  expired,
  suspended,
  terminated,
  leads,
  coonsiderableDataCount,
  newMonthPrevleadsCount,
  newMonthleadsCount,
  previousWeekleadsCount,
  newWeekleadsCount,
});
console.log("diff", t1 - t0);

try {
  const writeFiler = async () => {
    await fs.writeFile("./test.json", JSON.stringify(considerableleadsData));
  };

  writeFiler();
} catch (error) {
  console.log("err", error);
}
