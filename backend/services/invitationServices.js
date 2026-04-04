import Invitation from "../models/Invitation.js";
import User from "../models/User.js";

// send invite
export const sendInviteService = async (senderId, receiverId) => {
    if (senderId === receiverId) {
        throw new Error("Cannot invite yourself");
    }

    // check last rejected
    const lastReject = await Invitation.findOne({
        senderId,
        receiverId,
        status: "rejected",
    }).sort({ updatedAt: -1 });

    if (lastReject) {
        const diff = Date.now() - new Date(lastReject.updatedAt).getTime();
        const hours = diff / (1000 * 60 * 60);

        if (hours < 24) {
            throw new Error(`You can send invite after ${Math.ceil(24 - hours)} hours`);
        }
    }

    // check pending
    const existing = await Invitation.findOne({
        senderId,
        receiverId,
        status: "pending",
    });

    if (existing) {
        throw new Error("Already invited");
    }

    const invite = await Invitation.create({
        senderId,
        receiverId,
    });

    return invite;
};

// respond invite
export const respondInviteService = async (invitationId, status) => {
    const invite = await Invitation.findById(invitationId);
    const user = await User.findById(invite.senderId);
    const receiver = await User.findById(invite.receiverId);

    user.friends.push(receiver._id);
    receiver.friends.push(user._id);

    await user.save();
    await receiver.save();


    if (!invite) {
        throw new Error("Invite not found");
    }

    invite.status = status;
    await invite.save();

    return invite;
};

// get invite
export const getInvitationsService = async (userId) => {
    const invites = await Invitation.find({
        receiverId: userId,
        status: "pending",
    }).populate("senderId", "username email");

    return invites;
};