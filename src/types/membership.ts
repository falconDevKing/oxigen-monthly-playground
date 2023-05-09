import { Location, Action1 } from "./clientType";
import { Program } from "./services";

export type clientMemberships = {
  RestrictedLocations: Location[];
  IconCode: string;
  MembershipId: number;
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

export type activeClientsMemberships = {
  ClientId: string;
  Memberships: clientMemberships[];
  ErrorMessage: string;
};

type OnlineBookingRestrictedToMembersOnly = {
  Id: number;
  Name: string;
};

type siteMembership = {
  MembershipId: number;
  MembershipName: string;
  Priority: number;
  MemberRetailDiscount: number;
  MemberServiceDiscount: number;
  AllowClientsToScheduleUnpaid: boolean;
  OnlineBookingRestrictedToMembersOnly: OnlineBookingRestrictedToMembersOnly[];
  DayOfMonthSchedulingOpensForNextMonth: number;
  RestrictSelfSignInToMembersOnly: boolean;
  AllowMembersToBookAppointmentsWithoutPaying: boolean;
  AllowMembersToPurchaseNonMembersServices: boolean;
  AllowMembersToPurchaseNonMembersProducts: boolean;
  IsActive: boolean;
};

export default siteMembership;
