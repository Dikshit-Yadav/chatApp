import express from "express";
import { register, login, resetPass, logout, googleCallback, sendOtp, verifyOtp, sendForgetOtp} from "../controller/authController.js";
import passport from "passport";


const router = express.Router();

router.get("/google",
    passport.authenticate("google", {
        scope: ["profile", "email"]
    })
);
router.get("/google/callback",
    passport.authenticate('google', { session: false }), googleCallback)
router.post("/register", register);
router.post("/send-otp", sendOtp);
router.post("/send-otp/forgot", sendForgetOtp);
router.post("/verify", verifyOtp);
router.post("/login", login);
router.patch("/reset-password", resetPass);
router.post("/logout", logout);

export default router;