import moment from "moment";
import { modifyDate } from "../helpers/helpers";
import clientType from "../types/clientType";
import salesType from "../types/sales";

export const incomeAnalysis = (clientsData: clientType[], sales: salesType[], previousWeekBegin: string, weekBegin: string) => {
  // get week sales and sales by category ---> 44, AG, AH
  let totalWeeklyBilledIncome = 0;
  let totalWeeklyIncome = 0;
  (sales as salesType[])?.forEach((sale) => {
    const modFilterDate = modifyDate(sale.SaleDateTime);
    const considerableSale = moment(modFilterDate).isSameOrAfter(previousWeekBegin, "hour") && moment(weekBegin).isAfter(modFilterDate, "hour");
    if (considerableSale) {
      sale.PurchasedItems.forEach((purchasedItem, index) => {
        if (sale.Payments[index]?.TransactionId) {
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
    if (currentValue?.AccountBalance && currentValue?.AccountBalance < 0 && currentValue?.Id !== "100005814") {
      if (currentValue?.Status && currentValue?.Status !== "Non-Member" && currentValue?.Status !== "Terminated") {
        accountBalance += currentValue?.AccountBalance;
      }
      return [...accumulator, { clientId: currentValue?.Id, debt: currentValue?.AccountBalance, status: currentValue?.Status as string }];
    }

    return accumulator;
  }, [] as { clientId: string; debt: number; status: string }[]);

  return { totalWeeklyBilledIncome, totalWeeklyIncome, accountBalance, accountBalanceDebtorsIds };
};
