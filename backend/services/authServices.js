import User from "../models/User.js";
import bcrypt from "bcrypt";
import { sendEmail } from "../utils/sendMail.js";

const otpStore = new Map();

// register
export const registerUser = async ({ username, email, phone, password }) => {
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exists");

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
        username,
        email,
        phone,
        password: hashedPassword,
    });

    return newUser;
};

// login
export const loginUser = async ({ email, password }) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error("User not found");

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error("Invalid password");

    return user;
};

// send otp
export const sendOtpService = async (email) => {
    const user = await User.findOne({ email });
    if (user) throw new Error("User already exists");

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(
        email,
        "Your OTP Code",
        `<h2>Email Verification</h2>
         <h1>${otp}</h1>`
    );

    return true;
};

// verify otp
export const verifyOtpService = async (email, otp) => {
    const record = otpStore.get(email);

    if (!record) throw new Error("No OTP found");
    if (Date.now() > record.expiresAt) {
        otpStore.delete(email);
        throw new Error("OTP expired");
    }

    if (record.otp.toString() !== otp.toString()) {
        throw new Error("Invalid OTP");
    }

    otpStore.delete(email);
    return true;
};

// forgot pass otp
export const sendForgetOtpService = async (email) => {
    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore.set(email, {
        otp,
        expiresAt: Date.now() + 5 * 60 * 1000,
    });

    await sendEmail(
        email,
        "Forgot Password OTP",
        `<h1>${otp}</h1>`
    );

    return true;
};

// reset pass
export const resetPasswordService = async (email, password) => {
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.findOneAndUpdate({email}, {
        password: hashedPassword,
    });

    return true;
};

