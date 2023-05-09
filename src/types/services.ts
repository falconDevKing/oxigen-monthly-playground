enum Action1 {
  None = "None",
  Added = "Added",
  Updated = "Updated",
  Failed = "Failed",
  Removed = "Removed",
}

enum ScheduleType {
  All = "All",
  Class = "Class",
  Enrollment = "Enrollment",
  Appointment = "Appointment",
  Resource = "Resource",
  Media = "Media",
  Arrival = "Arrival",
}

type PricingRelationships = {
  PaysFor: number[];
  PaidBy: number[];
};

export type Program = {
  Id: number;
  Name: string;
  ScheduleType: ScheduleType;
  CancelOffset: number;
  ContentFormats: string[];
  PricingRelationships: PricingRelationships;
};

export type clientService = {
  ActiveDate: string;
  Count: number;
  Current: boolean;
  ExpirationDate: string;
  Id: number;
  ProductId: number;
  Name: string;
  PaymentDate: string;
  Program: Program;
  Remaining: number;
  SiteId: number;
  Action: Action1;
  ClientID: string;
};

type services = {
  Price: number;
  OnlinePrice: number;
  TaxIncluded: number;
  ProgramId: number;
  TaxRate: number;
  ProductId: number;
  Id: string;
  Name: string;
  Count: number;
  SellOnline: boolean;
  SaleInContractOnly: boolean;
  Type: string;
  ExpirationType: string;
  ExpirationUnit: string;
  ExpirationLength: number;
  RevenueCategory: string;
  MembershipId: number;
  SellAtLocationIds: number[];
  UseAtLocationIds: number[];
  Priority: string;
  IsIntroOffer: boolean;
  IntroOfferType: string;
  IsThirdPartyDiscountPricing: boolean;
  Program: string;
  Discontinued: boolean;
};

export default services;
