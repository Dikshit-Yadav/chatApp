import api, { API_ENDPOINTS } from "./api";
import type{
  AuthPayload,
  RegisterPayload,
  AuthResponse,
  OtpResponse,
} from "../types/auth.ts";

// login
export const loginUser = (data: AuthPayload) => {
  return api.post<AuthResponse>(API_ENDPOINTS.AUTH.LOGIN, data);
};

// register
export const registerUser = (data: RegisterPayload) => {
  return api.post<AuthResponse>(API_ENDPOINTS.AUTH.REGISTER, data);
};

// send otp (register)
export const sendOtp = (email: string) => {
  return api.post<OtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP, { email });
};

// forgot password otp
export const sendOtpForgot = (email: string) => {
  return api.post<OtpResponse>(API_ENDPOINTS.AUTH.SEND_OTP_FORGOT, { email });
};

// verify otp
export const verifyOtp = (email: string, otp: string) => {
  return api.post<OtpResponse>(API_ENDPOINTS.AUTH.VERIFY_OTP, { email, otp });
};

//reset pass
export const resetPassword = (email: string, password: string) => {
  return api.patch<AuthResponse>(API_ENDPOINTS.AUTH.RESET_PASSWORD, { email, password });
};