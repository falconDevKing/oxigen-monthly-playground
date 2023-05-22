import { Location, Action1 } from "./clientType";
import { Program } from "./services";

export type clientMemberships = {
  RestrictedLocations: Location[] | null;
  IconCode: string | null;
  MembershipId: number | null;
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
