import moment from "moment";
import { modifyDate } from "../helpers/helpers";
import clientType from "../types/clientType";
import salesType from "../types/sales";

export const incomeAnalysis = (clientsData: clientType[], sales: salesType[], previousMonthBegin: string, monthBegin: string) => {
  // get Month sales and sales by category ---> 44, AG, AH
  let totalMonthlyBilledIncome = 0;
  let totalMonthlyIncome = 0;
  (sales as salesType[])?.forEach((sale) => {
    const modFilterDate = modifyDate(sale.SaleDateTime);
    const considerableSale = moment(modFilterDate).isSameOrAfter(previousMonthBegin, "hour") && moment(monthBegin).isAfter(modFilterDate, "hour");
    if (considerableSale) {
      sale.PurchasedItems.forEach((purchasedItem, index) => {
        if (sale.Payments[index]?.TransactionId) {
          totalMonthlyIncome = totalMonthlyIncome + purchasedItem.TotalAmount;
          if (purchasedItem.ContractId) {
            totalMonthlyBilledIncome = totalMonthlyBilledIncome + purchasedItem.TotalAmount;
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

  return { totalMonthlyBilledIncome, totalMonthlyIncome, accountBalance, accountBalanceDebtorsIds };
};
