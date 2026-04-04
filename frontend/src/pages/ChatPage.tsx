import Sidebar from "../components/Sidebar";
import AddFriend from "./AddFriend";
import { Routes, Route } from "react-router-dom";
// import RightPanel from "../components/RightPanel";


export default function ChatPage() {
  return (
    <div className="flex">

      <Sidebar />
      <Routes>
        <Route path="/add-friend" element={<AddFriend />} />
      </Routes>
      {/* <RightPanel /> */}

    </div>
  );
}