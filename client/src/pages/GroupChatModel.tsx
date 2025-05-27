import { useState, useContext } from 'react';
import { X, Users } from 'lucide-react';
import axios from 'axios';
import { UserContext } from './userProvider.tsx';
import type { GroupChatModalProps } from '@/interfaces/Page.interface.ts';

const GroupChatModal = ({
  closeModal,
  SelectedChats,
  handleFetchAgain,
  setSelectedChats,
  setExistingChats,
}: GroupChatModalProps) => {
  const [groupName, setGroupName] = useState('');
  const [search, setSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const context = useContext(UserContext);
  if (!context) {
    throw new Error('GroupChatModal must be used within a UserProvider');
  }
  const { User } = context;

  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSearch = async (searchTerm: any) => {
    setSearch(searchTerm);
    try {
      const response: any = await axios.get(
        `${apiUrl}/api/users?search=${searchTerm}`,
        { withCredentials: true }
      );

      const filteredUsers = response.data.data.filter(
        (user: any) =>
          !SelectedChats?.users.some(
            (existingUser: any) => existingUser._id === user._id
          )
      );

      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
    }
  };

  const handleUserSelect = (user: any) => {
    setSelectedUsers((prev: any) =>
      prev.some((u: any) => u._id === user._id)
        ? prev.filter((u: any) => u._id !== user._id)
        : [...prev, user]
    );
  };

  const handleRename = async () => {
    if (!groupName.trim()) return;

    try {
      const res: any = await axios.put(
        `${apiUrl}/api/chat/groupRename`,
        {
          chatId: SelectedChats._id,
          chatName: groupName,
        },
        { withCredentials: true }
      );

      setSelectedChats(res.data.data);
      setExistingChats((chats: any) =>
        chats.map((chat: any) =>
          chat._id === SelectedChats._id
            ? { ...chat, chatName: groupName }
            : chat
        )
      );
      handleFetchAgain();
      closeModal();
    } catch (error) {
      console.error('Error renaming group:', error);
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.put(
        `${apiUrl}/api/chat/groupRemove`,
        {
          chatId: SelectedChats._id,
          userId: User._id,
        },
        { withCredentials: true }
      );
      closeModal();
      handleFetchAgain();
    } catch (error) {
      console.error('Error leaving group:', error);
    }
  };

  const handleAddUser = async () => {
    try {
      const promises = selectedUsers.map((user: any) =>
        axios.put(
          `${apiUrl}/api/chat/groupAdd`,
          {
            chatId: SelectedChats._id,
            userId: user._id,
          },
          { withCredentials: true }
        )
      );

      await Promise.all(promises);

      // Refetch updated chat
      const res:any = await axios.get(
        `${apiUrl}/api/chat/${SelectedChats._id}`,
        { withCredentials: true }
      );

      setSelectedChats(res.data.data);
      setExistingChats((chats: any) =>
        chats.map((chat: any) =>
          chat._id === SelectedChats._id ? res.data.data : chat
        )
      );

      setSelectedUsers([]);
      handleFetchAgain();
    } catch (error) {
      console.error('Error adding users:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-800">Group Settings</h2>
          <button
            onClick={closeModal}
            className="text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          {/* Group Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Group Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Enter new group name"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={handleRename}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Update
              </button>
            </div>
          </div>

          {/* Add Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Add Members
            </label>
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder="Search users"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Search Results */}
          <div className="max-h-40 overflow-y-auto">
            {searchResults.map((user: any) => (
              <div
                key={user._id}
                onClick={() => handleUserSelect(user)}
                className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer ${
                  selectedUsers.some((u: any) => u._id === user._id)
                    ? 'bg-blue-50'
                    : 'hover:bg-gray-50'
                }`}
              >
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={16} className="text-blue-600" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Users Preview */}
          {selectedUsers.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2">
              {selectedUsers.map((user: any) => (
                <span
                  key={user._id}
                  className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {user.name}
                  <button
                    onClick={() => handleUserSelect(user)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    <X size={14} />
                  </button>
                </span>
              ))}
              <button
                onClick={handleAddUser}
                className="ml-auto px-3 py-1 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Add
              </button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between pt-4 border-t">
            <button
              onClick={handleLeaveGroup}
              className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              Leave Group
            </button>
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupChatModal;
