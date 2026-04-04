import { MessageCircle, UserPlus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
    const user = localStorage.getItem("user");
    const username = JSON.parse(user).username;
    const profilePic = JSON.parse(user).profilePic;
    const navigate = useNavigate();

    return (
        <div className="w-[240px] h-screen bg-white shadow-lg flex flex-col justify-between p-4">

            <div>
                <div className="flex items-center gap-3 mb-6">
                    <img
                        src={profilePic || "https://i.pravatar.cc/40"}
                        alt="profile"
                        className="w-10 h-10 rounded-full object-cover"
                    />
                    <div>
                        <h2 className="text-sm font-semibold text-gray-800">{username}</h2>
                        <p className="text-xs text-green-500">Online</p>
                    </div>
                </div>
                <div className="space-y-4">
                    <button className="flex items-center gap-3 w-full p-2 rounded-lg bg-teal-100 text-teal-700">
                        <MessageCircle size={18} />
                        Messages
                    </button>

                    <button
                        onClick={() => navigate("/add-friend")}
                        className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100"
                    >
                        <UserPlus size={18} />
                        Add Friend
                    </button>
                </div>
            </div>

            <div className="space-y-4">
                <button className="flex items-center gap-3 w-full p-2 rounded-lg hover:bg-gray-100">
                    <Settings size={18} />
                    Settings
                </button>

                <button className="w-full bg-teal-600 text-white py-2 rounded-lg">
                    + Start Chat
                </button>
            </div>

        </div>
    );
}