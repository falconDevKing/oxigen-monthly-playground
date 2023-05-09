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
  ClientContractId: number;
  ChargeAmount: number;
  PaymentMethod: PaymentMethod;
  ScheduleDate: string;
};

type clientContracts = {
  AgreementDate: string;
  AutopayStatus: AutopayStatus;
  ContractName: string;
  EndDate: string;
  Id: number;
  OriginationLocationId: number;
  StartDate: string;
  SiteId: number;
  UpcomingAutopayEvents: UpcomingAutopayEvents;
  ContractID: number;
  TerminationDate: string;
};

export default clientContracts;
