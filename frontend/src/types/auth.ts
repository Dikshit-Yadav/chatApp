export type AuthPayload = {
  email: string;
  password: string;
};

export type RegisterPayload = {
  username: string;
  email: string;
  password: string;
};

export type OtpPayload = {
  email: string;
};

export type VerifyOtpPayload = {
  email: string;
  otp: string;
};

export type User = {
  _id: string;
  email: string;
  username?: string;
};

export type AuthResponse = {
  message: string;
  user: User;
};

export type OtpResponse = {
  message: string;
};