import clientType from "./clientType";
import clientContracts from "./contracts";
import { clientMemberships } from "./membership";
import { clientService } from "./services";

type clientArrivals = {
  ArrivalProgramID: number;
  ArrivalProgramName: string;
  CanAccess: boolean;
  LocationsIDs: number[];
};

type completeClientInfo = {
  Client: clientType;
  ClientServices: clientService[];
  ClientContracts: clientContracts[];
  ClientMemberships: clientMemberships[];
  ClientArrivals: clientArrivals[];
};

export default completeClientInfo;
