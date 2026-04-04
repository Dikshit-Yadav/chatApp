import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: "/auth/login",
    REGISTER: "/auth/register",
    SEND_OTP: "/auth/send-otp",
    SEND_OTP_FORGOT: "/auth/send-otp/forgot",
    VERIFY_OTP: "/auth/verify",
    RESET_PASSWORD: "/auth/reset-password",
  },
  USER: {
    SEARCH_FRIENDS: "/user/search",
    GET_REQUESTS: "/user/requests",
    RESPOND_INVITE: "/invite/respond",
  },
  INVITE: {
    RESPOND: "/invite/respond",
    SEND: "/invite/send",
    GET: "/invite",
  }
};

export default api;