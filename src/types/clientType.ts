import { type } from "os";

type Amenities = {
  Id: number;
  Name: string;
};

export type Location = {
  AdditionalImageURLs: string[] | null;
  Address: string | null;
  Address2: string | null;
  Amenities: Amenities[] | null;
  BusinessDescription: string | null;
  City: string | null;
  Description: string | null;
  HasClasses: boolean | null;
  Id: number | null;
  Latitude: number | null;
  Longitude: number | null;
  Name: string | null;
  Phone: string | null;
  PhoneExtension: string | null;
  PostalCode: string | null;
  SiteID: number | null;
  StateProvCode: string | null;
  Tax1: number | null;
  Tax2: number | null;
  Tax3: number | null;
  Tax4: number | null;
  Tax5: number | null;
  TotalNumberOfRatings: number | null;
  AverageRating: number | null;
  TotalNumberOfDeals: number | null;
};

type SalesRep = {
  FirstName: string;
  Id: number;
  LastName: string;
  SalesRepNumber: number;
  SalesRepNumbers: number[];
};

type ProspectStage = {
  Active: boolean;
  Description: string;
  Id: number;
};

type Liability = {
  AgreementDate: string | null;
  IsReleased: boolean | null;
  ReleasedBy: number | null;
};
export enum Action1 {
  None = "None",
  Added = "Added",
  Updated = "Updated",
  Failed = "Failed",
  Removed = "Removed",
}

export enum AppointmentGenderPreference {
  None = "None",
  Female = "Female",
  Male = "Male",
}

type CustomClientFieldValue = {
  Value: string;
  Id: number;
  DataType: string;
  Name: string;
};

type StringObject = {
  [x: string]: string | null;
};

type ClientIndex = {
  Id: number;
  ValueId: number;
};
type Relationship = {
  Id: number;
  RelationshipName1: string;
  RelationshipName2: string;
};
type ClientRelationship = {
  RelatedClientId: string;
  Relationship: Relationship;
  RelationshipName: string;
  Delete: boolean;
};

type Suspension = {
  BookingSuspended: boolean;
  SuspensionStartDate: string;
  SuspensionEndDate: string;
};

type clientType = {
  SuspensionInfo: Suspension | null;
  AppointmentGenderPreference: AppointmentGenderPreference | string;
  BirthDate: string | null;
  Country: string;
  CreationDate: string;
  CustomClientFields: CustomClientFieldValue[];
  ClientCreditCard: StringObject | null;
  ClientIndexes: ClientIndex[];
  ClientRelationships: ClientRelationship[];
  FirstAppointmentDate: string | null;
  FirstClassDate: string | null;
  FirstName: string;
  Id: string;
  IsCompany: boolean;
  IsProspect: boolean;
  LastName: string;
  Liability: Liability;
  LiabilityRelease: boolean;
  MembershipIcon: number;
  MobileProvider: number | null;
  Notes: string | null;
  State: string | null;
  UniqueId: number | null;
  LastModifiedDateTime: string | null;
  RedAlert: string | null;
  YellowAlert: string | null;
  MiddleName: string | null;
  ProspectStage: ProspectStage | null;
  Email: string | null;
  MobilePhone: string | null;
  HomePhone: string | null;
  WorkPhone: string | null;
  AccountBalance: number | null;
  AddressLine1: string | null;
  AddressLine2: string | null;
  City: string | null;
  PostalCode: string | null;
  WorkExtension: string | null;
  ReferredBy: string | null;
  PhotoUrl: string | null;
  EmergencyContactInfoName: string | null;
  EmergencyContactInfoEmail: string | null;
  EmergencyContactInfoPhone: string | null;
  EmergencyContactInfoRelationship: string | null;
  Gender: string | null;
  LastFormulaNotes: string | null;
  Active: boolean | null;
  SalesReps: SalesRep | null;
  Status: string | null;
  Action: Action1 | string | null;
  SendAccountEmails: boolean | null;
  SendAccountTexts: boolean | null;
  SendPromotionalEmails: boolean | null;
  SendPromotionalTexts: boolean | null;
  SendScheduleEmails: boolean | null;
  SendScheduleTexts: boolean | null;
  HomeLocation: Location | null;
  LockerNumber: string | null;
};

export default clientType;
