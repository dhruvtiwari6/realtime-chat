import  { useState } from 'react';
import { Search, X, Users } from 'lucide-react';
import axios from 'axios';

export const SideDrawer = ({ handleFetchAgain } : {handleFetchAgain :any}) => {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSearch = async () => {
    if (!search.trim()) {
      return;
    }

    try {
      const response: any = await axios.get(
        `${apiUrl}/api/users?search=${search}`,
        { withCredentials: true }
      );
      setUsers(response.data.data);
    } catch (error) {
      console.error("Search error:", error);
    }
  };

  const accessChat = async (userId :any) => {
    try {
      await axios.post(
        `${apiUrl}api/chat`,{ chattingUserId: userId },{ withCredentials: true }
      );
      handleFetchAgain();
      setIsOpen(false);
    } catch (error) {
      console.error("Chat access error:", error);
    }
  };

  return (
    <>
      <div className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-semibold text-gray-800">Chat App</h1>
          <button
            onClick={() => setIsOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Search size={18} />
            <span>Search Users</span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">Search Users</h2>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <X size={24} />
              </button>
            </div>

            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by name or email"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onClick={handleSearch}
              />
              <button
                onClick={handleSearch}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Search size={18} />
              </button>
            </div>

            <div className="max-h-64 overflow-y-auto">
              {users.map((user :any) => (
                <div
                  key={user._id}
                  onClick={() => accessChat(user._id)}
                  className="flex items-center gap-3 p-3 hover:bg-gray-50 rounded-lg cursor-pointer transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <Users size={20} className="text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-800">{user.name}</h3>
                    <p className="text-sm text-gray-500">{user.email}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};