export default function RightPanel() {
  return (
    <div className="flex-1 bg-gradient-to-br from-teal-100 to-slate-200 p-6">

      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-semibold">Cyan Velocity</h1>
        <div className="flex gap-4 text-sm text-gray-500">
          <span>Direct</span>
          <span className="font-semibold text-teal-600">Groups</span>
          <span>Channels</span>
        </div>
      </div>

      <div className="bg-teal-600 text-white rounded-2xl p-6 mb-6">
        <h2 className="text-xl font-semibold mb-2">New Group</h2>
        <p className="text-sm mb-4">
          Gather your favorite circle. Collaborate and share memories.
        </p>
        <button className="bg-white text-teal-600 px-4 py-2 rounded-lg">
          + Create Collective
        </button>
      </div>

      <div className="flex items-center bg-white rounded-lg shadow px-3 py-2 mb-6">
        <input
          type="text"
          placeholder="Search friends, groups, or channels..."
          className="flex-1 outline-none"
        />
        <button className="bg-teal-600 text-white px-4 py-1 rounded">
          Find
        </button>
      </div>

      <div className="space-y-4">
        {["Aaron", "Alice", "Arthur", "Bella", "Benjamin", "Diana"].map((name, i) => (
          <div
            key={i}
            className="bg-white p-3 rounded-xl shadow flex justify-between items-center"
          >
            <div>
              <p className="font-medium">{name}</p>
              <p className="text-sm text-gray-500">Online</p>
            </div>

            <button className="text-teal-600 text-sm">
              Chat
            </button>
          </div>
        ))}
      </div>

    </div>
  );
}