import express from "express";
import {invite, responseInvite, getInvitations} from "../controller/invitationController.js"
import { isAuthenticated } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/send", isAuthenticated, invite);
router.patch("/respond", isAuthenticated, responseInvite);
router.get("/", isAuthenticated, getInvitations);

export default router;