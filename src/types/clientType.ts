import { type } from "os";

type Amenities = {
  Id: number;
  Name: string;
};

export type Location = {
  AdditionalImageURLs: [];
  Address: string;
  Address2: string;
  Amenities: Amenities[];
  BusinessDescription: string;
  City: string;
  Description: string;
  HasClasses: boolean;
  Id: number;
  Latitude: number;
  Longitude: number;
  Name: string;
  Phone: string;
  PhoneExtension: string;
  PostalCode: string;
  SiteID: number;
  StateProvCode: string;
  Tax1: number;
  Tax2: number;
  Tax3: number;
  Tax4: number;
  Tax5: number;
  TotalNumberOfRatings: number;
  AverageRating: number;
  TotalNumberOfDeals: number;
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
  AgreementDate: string;
  IsReleased: boolean;
  ReleasedBy: number;
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
  [x: string]: string;
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
  SuspensionInfo: Suspension;
  AppointmentGenderPreference: AppointmentGenderPreference;
  BirthDate: string;
  Country: string;
  CreationDate: string;
  CustomClientFields: CustomClientFieldValue[];
  ClientCreditCard: StringObject;
  ClientIndexes: ClientIndex[];
  ClientRelationships: ClientRelationship[];
  FirstAppointmentDate: string;
  FirstClassDate: string;
  FirstName: string;
  Id: string;
  IsCompany: boolean;
  IsProspect: boolean;
  LastName: string;
  Liability: Liability;
  LiabilityRelease: boolean;
  MembershipIcon: number;
  MobileProvider: number;
  Notes: string;
  State: string;
  UniqueId: number;
  LastModifiedDateTime: string;
  RedAlert: string;
  YellowAlert: string;
  MiddleName: string;
  ProspectStage: ProspectStage;
  Email: string;
  MobilePhone: string;
  HomePhone: string;
  WorkPhone: string;
  AccountBalance: number;
  AddressLine1: string;
  AddressLine2: string;
  City: string;
  PostalCode: string;
  WorkExtension: string;
  ReferredBy: string;
  PhotoUrl: string;
  EmergencyContactInfoName: string;
  EmergencyContactInfoEmail: string;
  EmergencyContactInfoPhone: string;
  EmergencyContactInfoRelationship: string;
  Gender: string;
  LastFormulaNotes: string;
  Active: boolean;
  SalesReps: SalesRep;
  Status: string;
  Action: Action1;
  SendAccountEmails: boolean;
  SendAccountTexts: boolean;
  SendPromotionalEmails: boolean;
  SendPromotionalTexts: boolean;
  SendScheduleEmails: boolean;
  SendScheduleTexts: boolean;
  HomeLocation: Location;
  LockerNumber: string;
};

export default clientType;
