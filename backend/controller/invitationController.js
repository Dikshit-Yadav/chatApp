import * as invitationService from "../services/invitationServices.js";

// send invite
export const invite = async (req, res) => {
    try {
        const senderId = req.session.user.id;
        const { receiverId } = req.body;

        const invite = await invitationService.sendInviteService(
            senderId,
            receiverId
        );

        res.json({ message: "Invitation sent", invite });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// respond
export const responseInvite = async (req, res) => {
    try {
        const { invitationId, status } = req.body;

        const invite = await invitationService.respondInviteService(
            invitationId,
            status
        );

        res.json({
            message: `Invitation ${status}`,
            invite,
        });

    } catch (err) {
        res.status(400).json({ message: err.message });
    }
};

// get invites
export const getInvitations = async (req, res) => {
    try {
        const userId = req.session.user.id;

        const invites = await invitationService.getInvitationsService(userId);

        res.json(invites);

    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};