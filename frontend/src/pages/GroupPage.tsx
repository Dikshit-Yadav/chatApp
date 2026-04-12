import { useEffect, useState } from "react";
import {conversationApi} from "../services/conversationAPI";
import GroupSidebar from "../components/GroupSidebar";
import GroupChat from "../components/GroupChat";
import CreateGroupModal from "../components/CreateGroupModel";
import AddMemberModel from "../components/AddMemberModel";
import type{ Group } from "../types/group"

export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [groups, setGroups] = useState<Group[]>([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

 useEffect(() => {
  const fetchGroups = async () => {
    try {
      const res = await conversationApi.getGroups();
      console.log(res.data.groups)
      setGroups(res.data.groups);
    } catch (err) {
      console.error(err);
    }
  };

  fetchGroups();
}, []);
  return (
    <div className="flex h-screen">
      <GroupSidebar
        groups={groups}
        onSelect={setSelectedGroup}
        onCreate={() => setShowCreate(true)}
      />
      <GroupChat
        group={selectedGroup}
        onInvite={() => setShowInvite(true)}
        onGroupUpdate={(updatedGroup: Group) => {
          setSelectedGroup(updatedGroup);

          setGroups((prev) =>
            prev.map((g) =>
              g._id === updatedGroup._id ? updatedGroup : g
            )
          );
        }}
      />

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onGroupCreated={(newGroup: Group) => {
            setGroups((prev) => [newGroup, ...prev]);
            setSelectedGroup(newGroup);
          }}
        />
      )}

      {showInvite && selectedGroup && (
        <AddMemberModel
          group={selectedGroup}
          onClose={() => setShowInvite(false)}
          setGroups={setGroups}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
}