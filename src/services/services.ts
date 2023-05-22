import services from "../types/services";

export const introServicesIdsCreator = (services: services[]) => {
  //Filter services for intro  offers ids -> 11
  const introServicesIds = services?.reduce((accumulator, currentValue) => {
    if (currentValue.IsIntroOffer) {
      return [...accumulator, currentValue.ProductId];
    }
    return accumulator;
  }, [] as number[]);

  return introServicesIds;
};

export const packsUpfrontIdsCreator = (services: services[]) => {
  //get packs and upfront services id -> 18
  const packsUpfrontIds = services?.reduce((accumulator, currentValue) => {
    if (currentValue.MembershipId === 4434 || currentValue.MembershipId === 4435) {
      return [...accumulator, currentValue.ProductId];
    }
    return accumulator;
  }, [] as number[]);

  return packsUpfrontIds;
};
