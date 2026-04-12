import { useEffect } from "react";
import { socket } from "../contex/socket";
import { useGroupChatStore } from "../store/groupChatStore";

export const useGroupChatSocket = () => {
  const receiveMessage = useGroupChatStore((s) => s.receiveMessage);

  useEffect(() => {
    socket.on("receive-message", receiveMessage);

    return () => {
      socket.off("receive-message", receiveMessage);
    };
  }, []);
};