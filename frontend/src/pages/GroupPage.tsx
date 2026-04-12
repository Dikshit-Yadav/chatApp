import { useState } from "react";
import GroupSidebar from "../components/GroupSidebar";
import GroupChat from "../components/GroupChat";
import CreateGroupModal from "../components/CreateGroupModel";
import AddMemberModal from "../components/AddMemberModel";

export default function GroupPage() {
  const [selectedGroup, setSelectedGroup] = useState<any>(null);
  const [groups, setGroups] = useState([]);
  const [showCreate, setShowCreate] = useState(false);
  const [showInvite, setShowInvite] = useState(false);

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
        onGroupUpdate={(updatedGroup: any) => {
          setSelectedGroup(updatedGroup);

          setGroups((prev: any) =>
            prev.map((g: any) =>
              g._id === updatedGroup._id ? updatedGroup : g
            )
          );
        }}
      />

      {showCreate && (
        <CreateGroupModal
          onClose={() => setShowCreate(false)}
          onGroupCreated={(newGroup: any) => {
            setGroups((prev: any) => [newGroup, ...prev]);
            setSelectedGroup(newGroup);
          }}
        />
      )}

      {showInvite && selectedGroup && (
        <AddMemberModal
          group={selectedGroup}
          onClose={() => setShowInvite(false)}
          setGroups={setGroups}
          setSelectedGroup={setSelectedGroup}
        />
      )}
    </div>
  );
}