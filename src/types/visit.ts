import { Action1, AppointmentGenderPreference } from "./clientType";

export type activeLeadsClientInfoParams = {
  clientId: string;
  authToken: string;
  startDate: string;
  endDate: string;
  unpaidsOnly?: boolean;
};

enum AppointmentStatus {
  None = "None",
  Requested = "Requested",
  Booked = "Booked",
  Completed = "Completed",
  Confirmed = "Confirmed",
  Arrived = "Arrived",
  NoShow = "NoShow",
  Cancelled = "Cancelled",
  LateCancelled = "LateCancelled",
}

type visitType = {
  AppointmentId: number | null;
  AppointmentGenderPreference: string | null;
  AppointmentStatus: string | null;
  ClassId: number | null;
  ClientId: string | null;
  ClientUniqueId: number | null;
  StartDateTime: string | null;
  EndDateTime: string | null;
  Id: number | null;
  LastModifiedDateTime: string | null;
  LateCancelled: boolean | null;
  SiteId: number | null;
  LocationId: number | null;
  MakeUp: boolean | null;
  Name: string | null;
  ServiceId: number | null;
  ServiceName: string | null;
  ProductId: number | null;
  SignedIn: boolean | null;
  StaffId: number | null;
  WebSignup: boolean | null;
  Action: string | null;
  Missed: boolean | null;
  VisitType: number | null;
  TypeGroup: number | null;
  TypeTaken: string | null;
};

export default visitType;
