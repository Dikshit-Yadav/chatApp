import { useEffect, useRef, useState } from "react";
import { FaUsers } from "react-icons/fa";
import { socket } from "../contex/socket";
import { conversationApi } from "../services/conversationAPI";

export default function GroupChat({ group, onInvite, onGroupUpdate }: any) {
    const [messages, setMessages] = useState<any[]>([]);
    const [text, setText] = useState("");
    const [members, setMembers] = useState<any[]>([]);
    const [showMembers, setShowMembers] = useState(false);
    const [loadingId, setLoadingId] = useState<string | null>(null);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const loggedInUser = JSON.parse(
        localStorage.getItem("user") || "{}"
    );
    //   console.log(loggedInUser.profilePic)
    const isMe = (msg: any) => {
        const senderId =
            typeof msg.senderId === "object"
                ? msg.senderId._id
                : msg.senderId;

        return senderId === loggedInUser._id;
    };

    const removeMember = async (memberId: string) => {
        try {
            setLoadingId(memberId);

            const res = await conversationApi.removeMember(group._id, memberId);
            const updatedGroup = res.data.group;

            setMembers((prev) => prev.filter((m) => m._id !== memberId));
            onGroupUpdate(updatedGroup);

        } catch (err) {
            console.error("Failed to remove member", err);
        } finally {
            setLoadingId(null);
        }
    };

    useEffect(() => {
        if (group?.members) {
            setMembers(group.members);
        }
    }, [group]);
    useEffect(() => {
        if (!group) return;
        setMessages([]);
        socket.emit("join-conversation", {
            conversationId: group._id,
        });

        const handleMessage = (msg: any) => {
            if (msg.conversationId === group._id) {
                setMessages((prev) => [...prev, msg]);
            }
        };

        socket.on("receive-message", handleMessage);

        return () => {
            socket.emit("leave-conversation", {
                conversationId: group._id,
            });

            socket.off("receive-message", handleMessage);
        };
    }, [group]);

    useEffect(() => {
        if (!group) return;

        const fetchMessages = async () => {
            try {
                const res = await conversationApi.getMessages(group._id);
                console.log("API MESSAGES:", res.data);
                setMessages(res.data || []);
            } catch (err) {
                console.error("Error fetching messages", err);
            }
        };

        fetchMessages();
    }, [group]);

    // auto scroll
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const sendMessage = () => {
        if (!text.trim() || !group) return;

        socket.emit("send-message", {
            conversationId: group._id,
            message: text,
        });

        setText("");
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
                        <h3 className="font-semibold text-gray-800">
                            {group.groupName}
                        </h3>
                        <span className="text-xs text-gray-400">
                            Group chat
                        </span>
                    </div>
                </div>


                <div className="flex items-center gap-2">
                    <button
                        onClick={() => setShowMembers(true)}
                        className="bg-gray-200 hover:bg-gray-300 p-2 rounded-full"
                    >
                        <FaUsers />
                    </button>

                    <button
                        onClick={onInvite}
                        className="bg-teal-600 hover:bg-teal-700 text-white px-3 py-1 rounded-full text-sm"
                    >
                        + Add
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4">
                {messages.map((m, i) => {
                    const me = isMe(m);
                    const sender = m.senderId;

                    if (!m.message) return null;

                    return (
                        <div key={i} className={`flex ${me ? "justify-end" : "justify-start"}`}>
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

                                    <div className={`px-4 py-2 rounded-xl ${me ? "bg-teal-500 text-white" : "bg-white"
                                        }`}>
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

            <div className="p-3 bg-white flex items-center gap-2 shadow-md">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    className="flex-1 border border-gray-300 px-4 py-2 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                    placeholder="Type a message..."
                />

                <button
                    onClick={sendMessage}
                    className="bg-teal-600 hover:bg-teal-700 text-white px-5 py-2 rounded-full shadow"
                >
                    Send
                </button>
            </div>
            {showMembers && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white w-[350px] max-h-[80vh] rounded-lg p-4 overflow-y-auto">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="font-semibold text-lg">Group Members</h2>
                            <button onClick={() => setShowMembers(false)}>✖</button>
                        </div>

                        <div className="flex flex-col gap-3">
                            {members.map((member: any) => (
                                <div
                                    key={member._id}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center gap-2">
                                        <img
                                            src={member.profilePic || "https://i.pravatar.cc/40"}
                                            className="w-8 h-8 rounded-full"
                                        />
                                        <span>{member.username}</span>
                                    </div>

                                    {member._id !== loggedInUser._id && (
                                        <button
                                            disabled={loadingId === member._id}
                                            onClick={() => removeMember(member._id)}
                                            className="text-red-500 text-sm"
                                        >
                                            {loadingId === member._id ? "Removing..." : "Remove"}
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}