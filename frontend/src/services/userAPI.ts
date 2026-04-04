import api,{ API_ENDPOINTS } from "./api";

export const searchUsers = (search: string) => {
  return api.get(`${API_ENDPOINTS.USER.SEARCH_FRIENDS}?search=${search}`);
};

export const getRequests = () => {
  return api.get(API_ENDPOINTS.USER.GET_REQUESTS);
};

export const respondInvite = (invitationId: string, status: string) => {
  return api.post(API_ENDPOINTS.USER.RESPOND_INVITE, { invitationId, status });
};