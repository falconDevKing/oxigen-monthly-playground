// group membershipsids by groups and import 36, M
import {
  unlimitedBilledIds,
  limitedBilledIds,
  complimentaryIds,
  challengeUpfrontIds,
  paidInFullIds,
  classPassIds,
  inActiveIds,
} from "../sampleData/membershipGroupings";
import clientType from "../types/clientType";
import { getFile } from "../helpers/dynamoDB";
import { activeClientsMemberships } from "../types/membership";

export const membershipAnalysis = (clientsData: clientType[], activeLeadsIds: string[], activeLeadsClientsMemberships: activeClientsMemberships[]) => {
  // const accountBalanceIds: string[] = [];
  const suspendedMembersIds: string[] = [];
  const declinedMembersIds: string[] = [];
  const terminatedMembersIds: string[] = [];

  // create grouped clients by statuses ---> 37
  // get grouped clients ---> 34, V - AE
  const getGenericFigures = (clients: clientType[]) => {
    let active = 0;
    let declined = 0;
    let expired = 0;
    let suspended = 0;
    let terminated = 0;
    let nonMember = 0;

    clients.forEach((client) => {
      if (client.Status === "Active") {
        active += 1;
      }
      if (client.Status === "Terminated") {
        terminated += 1;
        terminatedMembersIds.push(client.Id);
      }
      if (client.Status === "Expired") {
        expired += 1;
      }
      if (client.Status === "Suspended") {
        suspended += 1;
        suspendedMembersIds.push(client.Id);
      }
      if (client.Status === "Declined") {
        declined += 1;
        declinedMembersIds.push(client.Id);
      }
      if (client.Status === "Non-Member") {
        nonMember += 1;
      }
    });

    return { active, declined, expired, suspended, terminated, nonMember };
  };

  // create grouped clients by memberships ---> 38
  const getMembershipFigures = (clientsMembershipData: string[], activeLeadsClientsMemberships: activeClientsMemberships[]) => {
    let unlimited = 0;
    let limited = 0;
    let challenge = 0;
    let complimentary = 0;
    let paidInFull = 0;
    let classPass = 0;
    let inActive = 0;

    clientsMembershipData.forEach((clientId) => {
      //is it necessary to find since the data was generated from the finding id
      const membershipsIds = activeLeadsClientsMemberships
        .find((activeLeadsClientsMembership) => activeLeadsClientsMembership?.ClientId === clientId)
        ?.Memberships?.map((membership) => membership.MembershipId) as number[];

      const uniqueMembershipIds = Array.from(new Set(membershipsIds));

      uniqueMembershipIds?.forEach((membershipId: number) => {
        if (unlimitedBilledIds.includes(membershipId)) {
          unlimited += 1;
        }
        if (limitedBilledIds.includes(membershipId)) {
          limited += 1;
        }
        if (challengeUpfrontIds.includes(membershipId)) {
          challenge += 1;
        }
        if (complimentaryIds.includes(membershipId)) {
          complimentary += 1;
        }
        if (paidInFullIds.includes(membershipId)) {
          paidInFull += 1;
        }
        if (classPassIds.includes(membershipId)) {
          classPass += 1;
        }
        if (inActiveIds.includes(membershipId)) {
          inActive += 1;
        }
      });
    });

    return { unlimited, limited, challenge, complimentary, paidInFull, classPass, inActive };
  };

  // exceute client grouping function and combined --> 39
  const genericMembershipFigures = getGenericFigures(clientsData);
  const membershipFigures = getMembershipFigures(activeLeadsIds, activeLeadsClientsMemberships);

  const membershipValues = Object.assign(genericMembershipFigures, membershipFigures);

  // get totalBilled and active billed --> 40,T,U
  const activeBilled = membershipValues.unlimited + membershipValues.limited + membershipValues.declined;
  const totalBilled = activeBilled + membershipValues.suspended;

  return { membershipValues, activeBilled, totalBilled, suspendedMembersIds, declinedMembersIds, terminatedMembersIds };
};

export const weeklyCancellationsAnalysis = async (fileName: string, newTerminations: string[]) => {
  const extraData = await getFile(fileName);
  const oldTerminations = extraData?.terminatedMembersIds;

  const weeklyCancellationsIDs = newTerminations.filter((newTerminatedId: string) => !oldTerminations.includes(newTerminatedId));
  const weeklyCancellations = weeklyCancellationsIDs.length;

  return { weeklyCancellations, weeklyCancellationsIDs };
};
