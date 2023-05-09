import { type } from "os";
import clientType from "./clientType";
import { Location } from "./clientType";
import visit from "./visit";
import { Program } from "./services";

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
  StartDateTime: string;
  EndDateTime: string;
  DailyStartTime: string;
  DailyEndTime: string;
};

enum BookingStatus {
  PaymentRequired = "PaymentRequired",
  BookAndPayLater = "BookAndPayLater",
  Free = "Free",
}

type classes = {
  ClassScheduleId: number;
  Visits: visit[];
  Clients: clientType[];
  Location: Location;
  Resource: null;
  MaxCapacity: number;
  WebCapacity: number;
  TotalBooked: number;
  TotalSignedIn: number;
  TotalBookedWaitlist: number;
  WebBooked: number;
  SemesterId: number;
  IsCanceled: boolean;
  Substitute: boolean;
  Active: boolean;
  IsWaitlistAvailable: boolean;
  IsEnrolled: boolean;
  HideCancel: boolean;
  Id: number;
  IsAvailable: boolean;
  StartDateTime: string;
  EndDateTime: string;
  LastModifiedDateTime: string;
  ClassDescription: {
    Active: true;
    Description: "<div>One of F45&rsquo;s latest workouts, Empire will have you sweating it out in a team training-style, combo set cardio workout. Moving through 6 combo stations and working with a timing of 45 seconds of work and 15 seconds of rest, members will be raising their heart rates after 3 laps!</div>";
    Id: 20037;
    ImageURL: null;
    LastUpdated: "2020-01-19T12:21:33.617";
    Level: null;
    Name: "Empire";
    Notes: null;
    Prereq: null;
    Program: {
      Id: 22;
      Name: "Functional Team Training";
      ScheduleType: "Class";
      CancelOffset: 60;
      ContentFormats: ["InPerson"];
      PricingRelationships: null;
    };
    SessionType: { Type: "All"; DefaultTimeLength: null; StaffTimeLength: null; Id: 10005; Name: "Cardio"; NumDeducted: 1; ProgramId: 22 };
    Category: "Circuit training";
    CategoryId: 34;
    Subcategory: "General";
    SubcategoryId: 45;
  };
  Staff: {
    Address: "";
    AppointmentInstructor: false;
    AlwaysAllowDoubleBooking: false;
    Bio: "";
    City: "";
    Country: "GB";
    Email: "soho@f45training.co.uk";
    FirstName: "Team";
    DisplayName: "Team F45 Soho";
    HomePhone: null;
    Id: 100000006;
    IndependentContractor: false;
    IsMale: false;
    LastName: "F45 Soho";
    MobilePhone: "07394851872";
    Name: "Team F45 Soho";
    PostalCode: null;
    ClassTeacher: false;
    SortOrder: 0;
    State: "LDN";
    WorkPhone: null;
    ImageUrl: null;
    ClassAssistant: false;
    ClassAssistant2: false;
    EmploymentStart: null;
    EmploymentEnd: null;
    ProviderIDs: null;
    Rep: false;
    Rep2: false;
    Rep3: false;
    Rep4: false;
    Rep5: false;
    Rep6: false;
    StaffSettings: { UseStaffNicknames: false; ShowStaffLastNamesOnSchedules: true };
    Appointments: [];
    Unavailabilities: [];
    Availabilities: [];
    EmpID: null;
  };
  BookingWindow: BookingWindow;
  BookingStatus: BookingStatus;
  VirtualStreamLink: string;
};

export default classes;
