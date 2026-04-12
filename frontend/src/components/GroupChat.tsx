import { useEffect, useRef, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { useGroupChatStore } from "../store/groupChatStore";
import { useGroupChatSocket } from "../hooks/useGroupChatSocket";
import type { Conversation, Message, User } from "../types/type";

interface Props {
  group: Conversation | null;
  onInvite: () => void;
}

export default function GroupChat({ group, onInvite }: Props) {
  const {
    messages,
    members,
    loadingId,
    setGroup,
    fetchMessages,
    sendMessage,
    removeMember,
    deleteGroup,
    renameGroup,
  } = useGroupChatStore();

  useGroupChatSocket();

  const [text, setText] = useState("");
  const [showMembers, setShowMembers] = useState(false);
  const [editingName, setEditingName] = useState(false);
  const [newName, setNewName] = useState(group?.groupName || "");

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loggedInUser: User = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const adminId =
    typeof group?.admin === "object"
      ? group.admin._id
      : group?.admin;

  const isAdmin = adminId === loggedInUser._id;

  const isMe = (msg: Message): boolean => {
    const senderId =
      typeof msg.senderId === "object"
        ? msg.senderId._id
        : msg.senderId;

    return senderId === loggedInUser._id;
  };

  useEffect(() => {
    setGroup(group);
    if (group) {
      fetchMessages(group._id);
      setNewName(group.groupName || "");
    }
  }, [group]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!text.trim()) return;
    sendMessage(text);
    setText("");
  };

  const handleRename = async () => {
    if (!group || !newName.trim() || newName === group.groupName) {
      setEditingName(false);
      return;
    }

    await renameGroup(group._id, newName);
    setEditingName(false);
  };

  const handleDelete = async () => {
    if (!group) return;

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!confirmDelete) return;

    await deleteGroup(group._id);
  };

  if (!group) {
    return (
      <div className="flex-1 flex items-center justify-center text-gray-500">
        Select a group
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-screen bg-gray-100">

      <div className="sticky top-0 z-10 bg-white p-4 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-teal-500 flex items-center justify-center text-white font-bold">
            {group.groupName?.[0]?.toUpperCase()}
          </div>

          <div>
            {editingName ? (
              <input
                autoFocus
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                onBlur={handleRename}
                onKeyDown={(e) => e.key === "Enter" && handleRename()}
                className="font-semibold border-b border-teal-500 outline-none"
              />
            ) : (
              <h3
                onClick={() => setEditingName(true)}
                className="font-semibold cursor-pointer hover:text-teal-600"
              >
                {group.groupName}
              </h3>
            )}
            <span className="text-xs text-gray-400">Group chat</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowMembers(true)}
            className="bg-gray-200 p-2 rounded-full"
          >
            <FaUsers />
          </button>

          <button
            onClick={onInvite}
            className="bg-teal-600 text-white px-3 py-1 rounded-full text-sm"
          >
            + Add
          </button>

          {isAdmin && (
            <button
              onClick={handleDelete}
              className="bg-red-500 text-white px-3 py-1 rounded-full text-sm"
            >
              Delete
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
        {messages.map((m, i) => {
          if (!m.message) return null;

          const me = isMe(m);
          const sender = m.senderId;

          return (
            <div key={m._id || i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
              <div className="flex items-end gap-2 max-w-[70%]">

                {!me && (
                  <img
                    src={sender?.profilePic || "https://i.pravatar.cc/40"}
                    className="w-8 h-8 rounded-full"
                  />
                )}

                <div>
                  {!me && (
                    <div className="text-xs text-gray-500">
                      {sender?.username}
                    </div>
                  )}

                  <div className={`px-4 py-2 rounded-xl ${me ? "bg-teal-500 text-white" : "bg-white"}`}>
                    {m.message}
                  </div>
                </div>

                {me && (
                  <img
                    src={loggedInUser.profilePic || "https://i.pravatar.cc/40"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
              </div>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      <div className="p-3 bg-white flex gap-2 shadow-md">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          className="flex-1 border px-4 py-2 rounded-full"
          placeholder="Type a message..."
        />

        <button
          onClick={handleSend}
          className="bg-teal-600 text-white px-5 py-2 rounded-full"
        >
          Send
        </button>
      </div>

      {showMembers && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white w-[360px] max-h-[80vh] rounded-2xl p-5 overflow-y-auto">

            <h2 className="font-semibold text-lg mb-4">Group Members</h2>

            <div className="flex flex-col gap-4">
              {members.map((member, index) => {
                if (typeof member === "string") return null;
                const user = member as User;

                return (
                  <div key={user._id || index} className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.profilePic || "https://i.pravatar.cc/40"}
                        className="w-9 h-9 rounded-full"
                      />
                      <span>{user.username}</span>
                    </div>

                    {user._id !== loggedInUser._id && (
                      <button
                        disabled={loadingId === user._id}
                        onClick={() => removeMember(group._id, user._id)}
                        className="text-xs bg-red-100 text-red-600 px-3 py-1 rounded-full"
                      >
                        {loadingId === user._id ? "Removing..." : "Remove"}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>

            <button
              onClick={() => setShowMembers(false)}
              className="mt-5 w-full bg-gray-200 py-2 rounded-lg"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}