import api,{ API_ENDPOINTS } from "./api";

// send invite
export const sendInvite = (receiverId: string) => {
  return api.post(API_ENDPOINTS.INVITE.SEND, { receiverId });
};

// respond invite
export const respondInvite = (invitationId: string, status: string) => {
  return api.patch(API_ENDPOINTS.INVITE.RESPOND, { invitationId, status });
};

// get invites
export const getInvitations = () => {
  return api.get(API_ENDPOINTS.INVITE.GET);
};
