import { useEffect, useState } from "react";
import { conversationApi } from "../services/conversationAPI";
import { getFriends } from "../services/userAPI";
import type { Conversation, User } from "../types/type";

type Props = {
  group: Conversation;
  onClose: () => void;
  setGroups: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setSelectedGroup: React.Dispatch<React.SetStateAction<Conversation | null>>;
};

export default function AddMemberModel({
  group,
  onClose,
  setGroups,
  setSelectedGroup,
}: Props) {
  const [friends, setFriends] = useState<User[]>([]);
  const [members, setMembers] = useState<User[]>([]);

  useEffect(() => {
    fetchFriends();
  }, []);

  const fetchFriends = async () => {
    try {
      const res = await getFriends();
      setFriends(res.data.friends || []);
    } catch (err) {
      console.error(err);
    }
  };

  // check user in group
  const isMember = (userId: string): boolean => {
    return members.some((m) => m._id === userId);
  };

  // add member
  const addMember = async (userId: string) => {
    try {
      const res = await conversationApi.addMember(group._id, userId);

      const updatedGroup = res.data.group;

      setMembers(updatedGroup.members as User[]);
      setSelectedGroup(updatedGroup);

      setGroups((prev) =>
        prev.map((g) =>
          g._id === updatedGroup._id ? updatedGroup : g
        )
      );

    } catch (err) {
      console.error("Failed to add member", err);
    }
  };

  useEffect(() => {
    setMembers(group?.members || []);
  }, [group]);

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center">
      <div className="bg-white p-5 rounded-xl w-80 shadow-lg">

        <h2 className="text-lg font-semibold mb-3 text-gray-800">
          Add Members
        </h2>

        <div className="flex flex-col gap-2 max-h-60 overflow-y-auto">
          {friends.map((f) => (
            <div
              key={f._id}
              className="flex justify-between items-center p-2 rounded hover:bg-gray-100"
            >
              <span className="text-sm">{f.username}</span>

              <button
                disabled={isMember(f._id)}
                onClick={() => addMember(f._id)}
                className={`px-3 py-1 text-xs rounded transition ${isMember(f._id)
                  ? "bg-gray-300 cursor-not-allowed"
                  : "bg-teal-500 text-white hover:bg-teal-600"
                  }`}
              >
                {isMember(f._id) ? "Added" : "Add"}
              </button>
            </div>
          ))}
        </div>

        <button
          onClick={onClose}
          className="mt-4 w-full bg-gray-200 hover:bg-gray-300 py-1.5 rounded text-sm"
        >
          Close
        </button>
      </div>
    </div>
  );
}