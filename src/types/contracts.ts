enum AutopayStatus {
  Active = "Active",
  Inactive = "Inactive",
  Suspended = "Suspended",
}

enum PaymentMethod {
  Other = "Other",
  CreditCard = "CreditCard",
  DebitAccount = "DebitAccount",
  ACH = "ACH",
}

type UpcomingAutopayEvents = {
  ClientContractId: number | null;
  ChargeAmount: number | null;
  PaymentMethod: PaymentMethod | string | null;
  ScheduleDate: string | null;
};

type clientContracts = {
  AgreementDate: string | null;
  AutopayStatus: AutopayStatus | string | null;
  ContractName: string | null;
  EndDate: string | null;
  Id: number | null;
  OriginationLocationId: number | null;
  StartDate: string | null;
  SiteId: number | null;
  UpcomingAutopayEvents: UpcomingAutopayEvents[];
  ContractID: number | null;
  TerminationDate: string | null;
};

export default clientContracts;
