import * as authService from "../services/authServices.js";

// register
export const register = async (req, res) => {
    try {
        const user = await authService.registerUser(req.body);

        req.session.user = {
            id: user._id,
            email: user.email,
        };

        res.status(201).json({ message: "User created", user });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// login
export const login = async (req, res) => {
    try {
        const user = await authService.loginUser(req.body);

        req.session.user = {
            id: user._id,
            email: user.email,
        };

        res.json({ message: "Login successful", user });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// send otp
export const sendOtp = async (req, res) => {
    try {
        await authService.sendOtpService(req.body.email);
        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// 
export const sendForgetOtp = async (req, res) => {
    try {
        await authService.sendForgetOtpService(req.body.email);
        res.json({ message: "OTP sent" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};
// verify otp
export const verifyOtp = async (req, res) => {
    try {
        await authService.verifyOtpService(req.body.email, req.body.otp);
        res.json({ message: "OTP verified" });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

//reset pass
export const resetPass = async (req, res) => {
    try {
        await authService.resetPasswordService(req.body.email, req.body.password);
        res.json({ message: "Password reset successful"});
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
}

// logout
export const logout = (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: err.message });
        }
        res.clearCookie("connect.sid");
        res.json({ message: "Logout successful" });
    });
};

//google callback
export const googleCallback = (req, res) => {
    try {
        if (!req.user) {
            return res.redirect("http://localhost:5173/login");
        }

        req.session.user = {
            id: req.user._id,
            email: req.user.email,
        };

        res.redirect("http://localhost:5173");
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};