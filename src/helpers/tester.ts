import moment from "moment";
import sales from "../sampleData/sales.json";
import transactions from "../sampleData/transactions.json";
import weekClasses from "../sampleData/weekClasses.json";

const formatString = "YYYY-MM-DDTHH:mm:ss[Z]";

const tester = async () => {
  try {
    // const authToken = await getBearerToken();
    // const services = await fetchServices(authToken);
    const previousWeekBegin = moment().startOf("week").subtract(3, "weeks").add(1, "days").format(formatString);
    const weekBegin = moment().startOf("week").subtract(2, "weeks").add(1, "days").format(formatString);
    let totalSalesIncome = 0;
    let totalBilledSalesIncome = 0;

    const filteredSale = sales.filter((sale) => moment(sale?.SaleDateTime).isBetween(previousWeekBegin, weekBegin, "day", "[)"));
    // console.log({ filteredSale: filteredSale.length });
    filteredSale.forEach((sale) => {
      // totalSalesIncome = totalSalesIncome + purchasedItem.TotalAmount;
      // sale.Payments.forEach((payment) => {
      //   if (payment.TransactionId) {
      sale.PurchasedItems.forEach((purchasedItem: any, index) => {
        if (sale.Payments[0].TransactionId) {
          totalSalesIncome = totalSalesIncome + purchasedItem.TotalAmount;
          if (purchasedItem.ContractId) {
            totalBilledSalesIncome = totalBilledSalesIncome + purchasedItem.TotalAmount;
          }
        }
      });
      //   }
      // });
    });
    // console.log(totalSalesIncome, totalBilledSalesIncome);

    let totalTransactionIncome = 0;
    const filteredTransaction = transactions.filter((transaction) => moment(transaction?.TransactionTime).isBetween(previousWeekBegin, weekBegin, "day", "[)"));
    // console.log({ filteredTransaction: filteredTransaction.length, previousWeekBegin, weekBegin });
    filteredTransaction.forEach((transaction: any) => {
      if (transaction.Settled) {
        totalTransactionIncome += transaction.Amount;
      }
    });
    // console.log(totalTransactionIncome);

    const nonCancelClasses = weekClasses.filter((weekClass) => !weekClass.IsCanceled);
    // await writeFiler("./src/checks/nonCancelClasses.json", nonCancelClasses);
    let totalSignIn = 0;
    const attendance = nonCancelClasses.reduce((accum, currentVal) => {
      totalSignIn += currentVal.TotalSignedIn;
      return accum + currentVal.TotalBooked;
    }, 0);
    console.log("nccl", nonCancelClasses.length, attendance, attendance - totalSignIn, totalSignIn);

    // console.log("tt", authToken, services.length, uuidv4());
  } catch (err) {
    console.log("tester", err);
  }
};
