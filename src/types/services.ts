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
  Id: number | null;
  Name: string | null;
  ScheduleType: ScheduleType | string | null;
  CancelOffset: number | null;
  ContentFormats: string[] | null;
  PricingRelationships: PricingRelationships | null;
};

export type clientService = {
  ActiveDate: string | null;
  Count: number | null;
  Current: boolean | null;
  ExpirationDate: string | null;
  Id: number | null;
  ProductId: number | null;
  Name: string | null;
  PaymentDate: string | null;
  Program: Program | null;
  Remaining: number | null;
  SiteId: number | null;
  Action: Action1 | string | null;
  ClientID: string | null;
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
