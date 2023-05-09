import Axios from "../helpers/axiosInstance";

export default async function fetchMemberships(authToken: string) {
  try {
    const fetchedMemberships = await Axios.get("site/memberships", { headers: { Authorization: authToken } });
    const memberships = fetchedMemberships.data?.Memberships;

    // const modifiedMemberships = memberships.map((membership: any) => {
    //   const updatedMembership = {
    //     MembershipId: membership.MembershipId,
    //     Priority: membership.Priority,
    //     MembershipName: membership.MembershipName,
    //     IsActive: membership.IsActive,
    //   };

    //   return updatedMembership;
    // });

    return memberships;
  } catch (err: any) {
    console.log("Error getting memberships", err?.message, err);
    throw new Error(err?.message ?? "Error getting memberships");
  }
}
