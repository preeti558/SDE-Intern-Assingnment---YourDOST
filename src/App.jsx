import { useEffect, useState } from "react";

export default function App() {
  const [users, setUsers] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("");
  const [filterLetter, setFilterLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(""); 


  const fetchUsers = async (pageNo = 1) => {
    setLoading(true);
    setError(""); 

    try {
      console.log("Fetching page:", pageNo); 
      const response = await fetch(`https://reqres.in/api/users?page=${pageNo}`, {
        headers: {
          'x-api-key': 'reqres-free-v1'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API Response:", data); 

      setUsers(data.data || []);
      setTotalPages(data.total_pages || 1);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Fetch failed:", err);
      setError("Failed to load users. Please try again later.");
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  // Trigger first load
  useEffect(() => {
    fetchUsers(1);
  }, []);

  // Filtering
  const filteredUsers = users
    .filter((u) =>
      `${u.first_name} ${u.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase())
    )
    .filter((u) =>
      filterLetter
        ? u.first_name.charAt(0).toLowerCase() === filterLetter.toLowerCase()
        : true
    );

  // Sorting
  const sortedUsers = sortKey
    ? [...filteredUsers].sort((a, b) => a[sortKey].localeCompare(b[sortKey]))
    : filteredUsers;

  return (
    <div className="min-h-screen bg-gray-200 p-4 sm:p-8 flex flex-col items-center">
      <h1 className="text-2xl sm:text-3xl font-bold mb-6 text-center text-teal-800">
        User Directory
      </h1>

      {/* Error Message */}
      {error && (
        <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-md max-w-4xl w-full text-center">
          {error}
        </div>
      )}

      {/* Controls */}
      <div className="lex gap-4 mb-6 flex-wrap">
        <input
          type="text"
          className="border border-teal-300 px-3 py-2 rounded-md w-full sm:w-64"
          placeholder="Search by name or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          className="border border-teal-300 px-3 py-2 rounded-md w-full sm:w-auto"
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value)}
        >
          <option value="">No Sorting</option>
          <option value="first_name">First Name</option>
          <option value="email">Email</option>
        </select>

        <select
          className="border border-teal-300 px-3 py-2 rounded-md w-full sm:w-auto"
          value={filterLetter}
          onChange={(e) => setFilterLetter(e.target.value)}
        >
          <option value="">All Letters</option>
          {"abcdefghijklmnopqrstuvwxyz".split("").map((l) => (
            <option key={l} value={l}>
              {l.toUpperCase()}
            </option>
          ))}
        </select>
      </div>

      {/* Table */}
      <div className="w-full max-w-4xl bg-white shadow rounded-lg overflow-x-auto">
        {loading ? (
          <div className="p-8 text-center text-teal-600 font-medium">
            <svg className="animate-spin h-8 w-8 mx-auto mb-2" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
                fill="none"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              />
            </svg>
            Loading users...
          </div>
        ) : sortedUsers.length > 0 ? (
          <table className="w-full table-auto">
            <thead className="bg-teal-200">
              <tr>
                <th className="px-4 py-3 text-left text-teal-900">Avatar</th>
                <th className="px-4 py-3 text-left text-teal-900">First Name</th>
                <th className="px-4 py-3 text-left text-teal-900">Last Name</th>
                <th className="px-4 py-3 text-left text-teal-900">Email</th>
              </tr>
            </thead>
            <tbody>
              {sortedUsers.map((u) => (
                <tr key={u.id} className="border-t hover:bg-teal-100 transition">
                  <td className="px-4 py-3">
                    <img
                      src={u.avatar}
                      alt={u.first_name}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                  </td>
                  <td className="px-4 py-3">{u.first_name}</td>
                  <td className="px-4 py-3">{u.last_name}</td>
                  <td className="px-4 py-3 text-teal-600">{u.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="text-center py-10 text-teal-500">
            No users found matching your criteria.
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex gap-4 items-center flex-wrap">
        <button
          onClick={() => setPage(p => Math.max(1, p - 1))}
          disabled={page === 1 || loading}
          className={`px-4 py-2 rounded-md ${page === 1 || loading
            ? "bg-teal-300 cursor-not-allowed"
            : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
        >
          Prev
        </button>

        <span className="font-medium text-teal-700">
          Page {page} of {totalPages}
        </span>

        <button
          onClick={() => setPage(p => Math.min(totalPages, p + 1))}
          disabled={page === totalPages || loading}
          className={`px-4 py-2 rounded-md ${page === totalPages || loading
            ? "bg-teal-300 cursor-not-allowed"
            : "bg-teal-600 text-white hover:bg-teal-700"
            }`}
        >
          Next
        </button>
      </div>
    </div>
  );
}