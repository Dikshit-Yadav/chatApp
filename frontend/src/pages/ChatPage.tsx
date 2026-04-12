import { useEffect, useState } from "react";
import { getMe } from "../services/userAPI.ts";
import Sidebar from "../components/Sidebar";
import AddFriend from "./AddFriend";
import RightPanel from "../components/RightPanel";
import ChatPanel from "../components/ChatPanel";
import { Routes, Route } from "react-router-dom";
import { socket } from "../contex/socket";
import ProfilePage from "../components/ProfilePanel";
import { conversationApi } from "../services/conversationAPI";
import GroupSidebar from "../components/GroupSidebar";
import GroupChat from "../components/GroupChat";
import CreateGroupModel from "../components/CreateGroupModel";
import AddMemberModel from "../components/AddMemberModel.tsx";

export default function ChatPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [groups, setGroups] = useState([]);


  useEffect(() => {
    async function initUser() {
      const storedUser = localStorage.getItem("user");

      if (!storedUser) {
        try {
          const res = await getMe();
          localStorage.setItem("user", JSON.stringify(res.data));
        } catch (err) {
          console.error(err);
        }
      }
    }
    initUser();
  }, []);

  useEffect(() => {
    const fetchGroups = async () => {
      const res = await conversationApi.getConversations();
      const groupChats = res.data.conversations?.filter((c: any) => c.isGroup) || [];
      setGroups(groupChats);
    };

    fetchGroups();
  }, []);
  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user && !socket.connected) {
      socket.connect();
    }
  }, []);

  return (
    <div className="flex h-screen w-full">
      <Sidebar />

      <Routes>

        <Route
          path="/*"
          element={
            <>
              {/* left panel */}
              <div className="flex flex-col w-[350px] border-r border-gray-200 overflow-hidden">
                <Routes>
                  <Route path="*" element={<RightPanel />} />
                </Routes>
              </div>

              {/* right panel */}
              <div className="flex-1 overflow-hidden">
                <Routes>
                  <Route path="add-friend" element={<AddFriend />} />
                  <Route path="messages/:conversationId" element={<ChatPanel />} />
                  <Route
                    path="profile"
                    element={
                      <ProfilePage
                        userId={
                          JSON.parse(localStorage.getItem("user") || "{}")._id
                        }
                      />
                    }
                  />
                </Routes>
              </div>
            </>
          }
        />

        <Route
          path="/groups"
          element={
            <>
              {/* group sidebar */}
              <GroupSidebar
                groups={groups}
                onSelect={setSelectedGroup}
                onCreate={() => setShowCreate(true)}
              />

              {/* group chat */}
              <GroupChat
                group={selectedGroup}
                onInvite={() => setShowInvite(true)}
                onGroupUpdate={(updated) => {
                  if (!updated) {
                    setSelectedGroup(null);
                    setGroups((prev: any) =>
                      prev.filter((g: any) => g._id !== selectedGroup?._id)
                    );
                    return;
                  }

                  setSelectedGroup(updated);
                  setGroups((prev: any) =>
                    prev?.map((g: any) =>
                      g._id === updated._id ? updated : g
                    )
                  );
                }}
              />


              {/* model */}
              {showCreate && (
                <CreateGroupModel onClose={() => setShowCreate(false)} />
              )}

              {showInvite && selectedGroup && (
                <AddMemberModel
                  group={selectedGroup}
                  onClose={() => setShowInvite(false)}
                  setGroups={setGroups}
                  setSelectedGroup={setSelectedGroup}
                />
              )}
            </>
          }
        />
      </Routes>
    </div>
  );
}