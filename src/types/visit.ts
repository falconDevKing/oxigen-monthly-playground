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
  AppointmentId: number;
  AppointmentGenderPreference: string;
  AppointmentStatus: string;
  ClassId: number;
  ClientId: string;
  ClientUniqueId: number;
  StartDateTime: string;
  EndDateTime: string;
  Id: number;
  LastModifiedDateTime: string;
  LateCancelled: boolean;
  SiteId: number;
  LocationId: number;
  MakeUp: boolean;
  Name: string;
  ServiceId: number;
  ServiceName: string;
  ProductId: number;
  SignedIn: boolean;
  StaffId: number;
  WebSignup: boolean;
  Action: string;
  Missed: boolean;
  VisitType: number;
  TypeGroup: number;
  TypeTaken: string;
};

export default visitType;
