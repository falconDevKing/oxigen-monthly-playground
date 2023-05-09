//GET NEW LEADS FOR THE WEEKS ---> C
//GET NEW LEADS FOR THE WEEKS ---> C
//GET NEW LEADS FOR THE WEEKS ---> C
// const servicesFiltering = (clientData as any[])?.forEach((client: any) => {
// const considerableLead = moment(client?.CreationDate).isBetween(previousWeekBegin, weekBegin, "day", "(]");
//   if (considerableLead) {
//     coonsiderableDataCount += 1;
//     considerableleadsData.push(client.Id);
//   }
// });

//get intro services
//get intro services
//get intro services
// const servicesFiltering = (services as any[])?.filter((service: any) => service.IsIntroOffer);

//get intro services id
//get intro services id
// const servicesFiltering = (services as any[])?.reduce((accumulator, currentValue) => {
//   if (currentValue.IsIntroOffer) {
//     return [...accumulator, currentValue.Id];
//   }
//   return accumulator;
// }, []);

//get week trials ---> D
//get week trials ---> D
//get week trials ---> D
// const weekTrials = weekLeadsIds.reduce((accumulator, currentVal) => {
//   const leadPurchasedItems = sales
//     .filter((sale) => sale.ClientId === currentVal && moment(curr.SaleDateTime).isBefore(moment(weekBegin).add(1, "day")))
//     .map((sale) => sale.PurchasedItems)
//     .flat();
//   const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => introServicesid.includes(leadPurchasedItem.Id));
//   const leadTrial = leadSaleItemsTrial.includes(true);

//   if (leadTrial) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

//get week trials alt ---> D
//get week trials alt ---> D
//get week trials alt ---> D
// const weekTrials = weekLeadsIds.reduce((accumulator, currentVal) => {
//   const leadPurchasedItems = sales
//     .reduce((acc, curr: any) => {
//       if (curr.ClientId === currentVal && moment(curr.SaleDateTime).isBefore(moment(weekBegin).add(1, "day"))) {
//         return [...acc, curr.PurchasedItems];
//       }
//       return [...acc];
//     }, [] as any[])
//     .flat();

//   const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => introServicesid.includes(leadPurchasedItem.Id));
//   const leadTrial = leadSaleItemsTrial.includes(true);

//   if (leadTrial) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

//GET NEW LEADS FOR THE MONTHS ---> F
//GET NEW LEADS FOR THE MONTHS ---> F
//GET NEW LEADS FOR THE MONTHS ---> F
// const servicesFiltering = (clientData as any[])?.forEach((client: any) => {
//   const considerableLead = moment(client?.CreationDate).isBetween(monthBegin, weekBegin, "day", "[]");

//   if (considerableLead) {
//     coonsiderableDataCount += 1;
//     considerableleadsData.push(client.Id);
//   }
// });

//get month trials alt ---> G
//get month trials alt ---> G
//get month trials alt ---> G
// const monthTrials = monthLeadsIds.reduce((accumulator, currentVal) => {
//   const leadPurchasedItems = sales
//     .reduce((acc, curr) => {
//       if (curr.ClientId === currentVal && moment(curr.SaleDateTime).isBefore(moment(weekBegin).add(1, "day"))) {
//         return [...acc, curr.PurchasedItems];
//       }
//       return [...acc];
//     }, [] as any[])
//     .flat();

//   const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => introServicesid.includes(leadPurchasedItem.Id));
//   const leadTrial = leadSaleItemsTrial.includes(true);

//   if (leadTrial) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);
// console.log("tr", monthTrials);

//get packs and upfront services id
//get packs and upfront services id
//get packs and upfront services id
// const servicesFiltering = (services as any[])?.reduce((accumulator, currentValue) => {
//   if (currentValue.MembershipId === 4434 || currentValue.MembershipId === 4435) {
//     return [...accumulator, currentValue.ProductId];
//   }
//   return accumulator;
// }, []);

// console.log("sl", servicesFiltering);

//get packs and upfront leads --> K
//get packs and upfront leads --> K
//get packs and upfront leads --> K
// const monthPacksUpfrontTrials = monthLeadsIds.reduce((accumulator, currentVal) => {
//   const leadPurchasedItems = sales
//     .reduce((acc, curr) => {
//       if (curr.ClientId === currentVal && moment(curr.SaleDateTime).isBefore(moment(weekBegin).add(1, "day"))) {
//         return [...acc, curr.PurchasedItems];
//       }
//       return [...acc];
//     }, [] as any[])
//     .flat();

//   const leadSaleItemsTrial = leadPurchasedItems.map((leadPurchasedItem) => PacksUpfrontIds.includes(leadPurchasedItem.Id));
//   const leadTrial = leadSaleItemsTrial.includes(true);

//   if (leadTrial) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);
// console.log("tr", monthPacksUpfrontTrials);

// get monthly billed leads --> I
// get monthly billed leads --> I
// get monthly billed leads --> I
// const monthBilled = monthLeadsIds.reduce((accumulator, currentVal) => {
//   const leadClientHasContracts = completeClientsInfo.find((completeClientInfo) => completeClientInfo?.Client?.Id === currentVal)?.ClientContracts?.length;
//   if (leadClientHasContracts) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

///get leads purchased nothing --> M
///get leads purchased nothing --> M
///get leads purchased nothing --> M
// const leadsPurchasedIds = Array.from(new Set([...sales.map((sale) => sale.ClientId), ...billedLeadsId]));
// const leadPurchasedNothing = monthLeadsIds.reduce((accumulator, currentValue) => {
//   if (!leadsPurchasedIds.includes(currentValue)) {
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

// console.log("tr", monthLeadsIds.length, leadsPurchasedIds.length, leadPurchasedNothing);

// get packs and upfront for month ---> S
// get packs and upfront for month ---> S
// get packs and upfront for month ---> S
// const monthPacksUpfront = sales
//   .reduce((accumulator, currentValue) => {
//     if (moment(currentValue.SaleDateTime).isBefore(moment(weekBegin).add(1, "day"))) {
//       return [...accumulator, ...currentValue.PurchasedItems];
//     } else {
//       return accumulator;
//     }
//   }, [] as any[])
//   .flat()
//   .reduce((accum, curVal) => {
//     if (PacksUpfrontIds.includes(curVal.Id)) {
//       return accum + 1;
//     } else {
//       return accum;
//     }
//   }, 0);

// console.log("mpun", monthPacksUpfront);

// get trials for month ---> N
// get trials for month ---> N
// get trials for month ---> N
// const trialPurchasersMth: string[] = [];

// const trialsPurchasedMTD = sales
//   .reduce((accumulator, currentValue) => {
//     if (moment(currentValue.SaleDateTime).isBefore(moment(weekBegin).add(1, "day"))) {
//       const purchasedItems = currentValue.PurchasedItems;
//       const modifiedPurchasedItems = purchasedItems.map((purchasedItem) => ({ ...purchasedItem, clientId: currentValue.ClientId }));

//       return [...accumulator, ...modifiedPurchasedItems];
//     } else {
//       return accumulator;
//     }
//   }, [] as any[])
//   .flat()
//   .reduce((accum, curVal) => {
//     if (introServicesId.includes(curVal.Id)) {
//       trialPurchasersMth.push(curVal.clientId);
//       return accum + 1;
//     } else {
//       return accum;
//     }
//   }, 0);

// console.log("tpmtd", trialsPurchasedMTD);
// console.log("tpIds", trialPurchasersMth);

// get trials first visits for month ---> O
// get trials first visits for month ---> O
// get trials first visits for month ---> O
// const trialsFirstVisitersMth: string[] = [];

// const trialsToFirstVisitMth = trialsVisitMth.reduce((accumulator, currentValue) => {
//   if (currentValue.length) {
//     trialsFirstVisitersMth.push(currentValue[0].ClientId);
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

// get monthly billed leads --> Q
// get monthly billed leads --> Q
// get monthly billed leads --> Q
// const trialsFirstVisitToBilled = trialsFirstVisitersMth.reduce((accumulator, currentVal) => {
//   const trialsFirstVisitersContracts = completeClientsInfo.find((completeClientInfo) => completeClientInfo?.Client?.Id === currentVal)?.ClientContracts?.length;
//   if (trialsFirstVisitersContracts) {
//     console.log(currentVal);
//     return accumulator + 1;
//   } else {
//     return accumulator;
//   }
// }, 0);

// console.log("tfvmtd", trialsToFirstVisitMth);
// console.log("tfvIds", trialsFirstVisitersMth);
// console.log("tfvtB", trialsFirstVisitToBilled);

// get week sales ---> AG, AH
// get week sales ---> AG, AH
// get week sales ---> AG, AH
// const salesFiltering = (sales as any[])?.forEach((sale: any) => {
//   const considerableSale = moment(sale?.SaleDateTime).isBetween(previousWeekBegin, weekBegin, "day", "(]");
//   if (considerableSale) {
//     const purchasedItems = sale.PurchasedItems.forEach((purchasedItem: any) => {
//       weeklySales = weeklySales + purchasedItem.TotalAmount;
//       if (purchasedItem.ContractId) {
//         weeklySalesBilled = weeklySalesBilled + purchasedItem.TotalAmount;
//       }
//     });
//   }
// });

// console.log(weeklySalesBilled, weeklySales);

// get week sales ---> AG, AH ALT
// get week sales ---> AG, AH ALT
// get week sales ---> AG, AH ALT
// const salesFiltering = (sales as any[])?.forEach((sale: any) => {
//   const considerableSale = moment(sale?.SaleDateTime).isBetween(previousWeekBegin, weekBegin, "day", "(]");
//   if (considerableSale) {
//     const purchasedItems = sale.PurchasedItems.forEach((purchasedItem: any) => {
//       weeklySales = weeklySales + purchasedItem.TotalAmount - purchasedItem.TaxAmount;
//       if (purchasedItem.ContractId) {
//         weeklySalesBilled = weeklySalesBilled + purchasedItem.TotalAmount - purchasedItem.TaxAmount;
//       }
//     });
//   }
// });

// console.log(weeklySalesBilled, weeklySales);

// get week sales ---> V - AE
// get week sales ---> V - AE
// get week sales ---> V - AE
// const getGenericFigures = (clients: any[]) => {
//   let declined = 0;
//   let expired = 0;
//   let suspended = 0;
//   let terminated = 0;
//   let nonMember = 0;

//   clients.forEach((client) => {
//     if (client.Status === "Terminated") {
//       terminated += 1;
//     }
//     if (client.Status === "Expired") {
//       expired += 1;
//     }
//     if (client.Status === "Suspended") {
//       suspended += 1;
//     }
//     if (client.Status === "Declined") {
//       declined += 1;
//     }
//     if (client.Status === "Non-Member") {
//       nonMember += 1;
//     }
//   });

//   return { declined, expired, suspended, terminated, nonMember };
// };

// const genericMembershipFigures = getGenericFigures(clientData as any[]);

// console.log(genericMembershipFigures);

// const getMembershipFigures = (clientsData: any[]) => {
//   let unlimited = 0;
//   let limited = 0;
//   let challenge = 0;
//   let complimentary = 0;
//   let paidInFull = 0;
//   let classPass = 0;
//   let inActive = 0;

//   clientsData.forEach((clientData) => {
//     const membershipsIds = clientData.ClientMemberships.map((clientMembership: any) => clientMembership.MembershipId);

//     membershipsIds.forEach((membershipId: number) => {
//       if (unlimitedBilledIds.includes(membershipId)) {
//         unlimited += 1;
//       }
//       if (limitedBilledIds.includes(membershipId)) {
//         limited += 1;
//       }
//       if (challengeUpfrontIds.includes(membershipId)) {
//         challenge += 1;
//       }
//       if (complimentaryIds.includes(membershipId)) {
//         complimentary += 1;
//       }
//       if (paidInFullIds.includes(membershipId)) {
//         paidInFull += 1;
//       }
//       if (classPassIds.includes(membershipId)) {
//         classPass += 1;
//       }
//       if (inActiveIds.includes(membershipId)) {
//         inActive += 1;
//       }
//     });
//   });

//   return { unlimited, limited, challenge, complimentary, paidInFull, classPass, inActive };
// };

// const membershipFigures = getMembershipFigures(completeClientsInfo);

// console.log(membershipFigures);

// const accountBalancesFigures = completeClientsInfo.map((clientInfo) => clientInfo.Client.AccountBalance);
// const accountBalancesOutliers = completeClientsInfo.reduce((accumulator, clientInfo) => {
//   const add = [-187.5, -120, -480, -31.88, -550, -13200, -360, -360, -102.5, -15, -720, -120, -918, -35, -20].includes(clientInfo?.Client?.AccountBalance);
//   if (add) {
//     return [...accumulator, clientInfo?.Client?.Id];
//   } else {
//     return accumulator;
//   }
// }, [] as any[]);
// console.log("abo", accountBalancesOutliers);

//get accountBalance -> 46, AJ
// const accountBalance = accountBalanceIds.reduce((accumulator, currentValue) => {
//   const clientData = (clientsData).find((clientData) => clientData.Id === currentValue);

//   if (clientData?.AccountBalance && clientData?.AccountBalance < 0) {
//     return accumulator + clientData?.AccountBalance;
//   }

//   return accumulator;
// }, 0);

// const accountBalance = (clientsData).reduce((accumulator, currentValue) => {
//   if (currentValue?.AccountBalance < 0 && currentValue.Id !== "100005814") {
//     return accumulator + currentValue?.AccountBalance;
//   }

//   return accumulator;
// }, 0);
