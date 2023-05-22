import { type } from "os";
import clientType from "./clientType";
import { Location } from "./clientType";
import visit from "./visit";
import { Program } from "./services";

export type staffData = {
  staffId: number | null;
  name: string | null;
  duration: number;
  attendance: number | null;
};

type AddOn = {
  Id: number | null;
  Name: string | null;
  StaffId: number | null;
  TypeId: number | null;
};

type ResourceSlim = {
  Id: number | null;
  Name: string | null;
};

export type Appointments = {
  GenderPreference: string | null;
  Duration: number | null;
  ProviderId: string | null;
  Id: number | null;
  Status: string | null;
  StartDateTime: string | null;
  EndDateTime: string | null;
  Notes: string | null;
  PartnerExternalId: string | null;
  StaffRequested: boolean | null;
  ProgramId: number | null;
  SessionTypeId: number | null;
  LocationId: number | null;
  StaffId: number | null;
  ClientId: boolean | null;
  FirstAppointment: boolean | null;
  IsWaitlist: boolean | null;
  WaitlistEntryId: number | null;
  ClientServiceId: number | null;
  Resources: ResourceSlim | null;
  AddOns: AddOn | null;
  OnlineDescription: string | null;
};

type Level = {
  Id: number;
  Name: string;
  Description: string;
};

enum typeSession {
  All = "All",
  Class = "Class",
  Enrollment = "Enrollment",
  Appointment = "Appointment",
  Resource = "Resource",
  Media = "Media",
  Arrival = "Arrival",
}

type SessionType = {
  Type: typeSession;
  DefaultTimeLength: number;
  StaffTimeLength: number;
  Id: number;
  Name: string;
  OnlineDescription: string;
  NumDeducted: number;
  ProgramId: number;
  Category: string;
  CategoryId: number;
  Subcategory: string;
  SubcategoryId: number;
};

type ClassDescription = {
  Active: boolean;
  Description: string;
  Id: number;
  ImageURL: string;
  LastUpdated: string;
  Level: Level;
  Name: string;
  Notes: string;
  Prereq: string;
  Program: Program;
  SessionType: SessionType;
  Category: string;
  CategoryId: number;
  Subcategory: string;
  SubcategoryId: number;
};

type BookingWindow = {
  StartDateTime: string | null;
  EndDateTime: string | null;
  DailyStartTime: string | null;
  DailyEndTime: string | null;
};

enum BookingStatus {
  PaymentRequired = "PaymentRequired",
  BookAndPayLater = "BookAndPayLater",
  Free = "Free",
}

type classes = {
  ClassScheduleId: number | null;
  Visits: visit[] | null;
  Clients: clientType[] | null;
  Location: Location | null;
  Resource: null | null;
  MaxCapacity: number | null;
  WebCapacity: number | null;
  TotalBooked: number | null;
  TotalSignedIn: number | null;
  TotalBookedWaitlist: number | null;
  WebBooked: number | null;
  SemesterId: number | null;
  IsCanceled: boolean | null;
  Substitute: boolean | null;
  Active: boolean | null;
  IsWaitlistAvailable: boolean | null;
  IsEnrolled: boolean | null;
  HideCancel: boolean | null;
  Id: number | null;
  IsAvailable: boolean | null;
  StartDateTime: string | null;
  EndDateTime: string | null;
  LastModifiedDateTime: string | null;
  ClassDescription: {
    Active: boolean | null;
    Description: string | null;
    Id: number | null;
    ImageURL: string | null;
    LastUpdated: string | null;
    Level: string | null;
    Name: string | null;
    Notes: string | null;
    Prereq: string | null;
    Program: {
      Id: number | null;
      Name: string | null;
      ScheduleType: string | null;
      CancelOffset: number | null;
      ContentFormats: string[] | null;
      PricingRelationships: string | null;
    } | null;
    SessionType: {
      Type: string | null;
      DefaultTimeLength: number | null;
      StaffTimeLength: number | null;
      Id: number | null;
      Name: string | null;
      NumDeducted: number | null;
      ProgramId: number | null;
    } | null;
    Category: string | null;
    CategoryId: number | null;
    Subcategory: string | null;
    SubcategoryId: number | null;
  };
  Staff: {
    Address: string | null;
    AppointmentInstructor: boolean | null;
    AlwaysAllowDoubleBooking: boolean | null;
    Bio: string | null;
    City: string | null;
    Country: string | null;
    Email: string | null;
    FirstName: string | null;
    DisplayName: string | null;
    HomePhone: string | null;
    Id: number | null;
    IndependentContractor: boolean | null;
    IsMale: boolean | null;
    LastName: string | null;
    MobilePhone: string | null;
    Name: string | null;
    PostalCode: string | null;
    ClassTeacher: boolean | null;
    SortOrder: number | null;
    State: string | null;
    WorkPhone: string | null;
    ImageUrl: string | null;
    ClassAssistant: boolean | null;
    ClassAssistant2: boolean | null;
    EmploymentStart: string | null;
    EmploymentEnd: string | null;
    ProviderIDs: null;
    Rep: boolean | null;
    Rep2: boolean | null;
    Rep3: boolean | null;
    Rep4: boolean | null;
    Rep5: boolean | null;
    Rep6: boolean | null;
    StaffSettings: { UseStaffNicknames: boolean | null; ShowStaffLastNamesOnSchedules: boolean | null } | null;
    Appointments: any[];
    Unavailabilities: any[];
    Availabilities: any[];
    EmpID: string | null;
  };
  BookingWindow: BookingWindow | null;
  BookingStatus: BookingStatus | string | null;
  VirtualStreamLink: string | null;
};

export default classes;
