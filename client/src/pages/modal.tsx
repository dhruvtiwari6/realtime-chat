import React, { useState } from 'react';
import axios from 'axios';
import type { GroupChatModalProps } from '@/interfaces/Page.interface.ts';

const Modal = ({ closeModal, setExistingChats }: GroupChatModalProps) => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState('');

  const apiUrl = import.meta.env.VITE_API_URL;


  const handleSearchUser = async (searchTerm: string) => {
    try {
      const response:any = await axios.get(`${apiUrl}/api/users?search=${searchTerm}`, { withCredentials: true });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearch(value);
    handleSearchUser(value);
  };

  const handleUserClick = (user: any) => {
    setSelectedUsers((prevSelected :any) =>
      prevSelected.some((u: any) => u.email === user.email)
        ? prevSelected.filter((u: any) => u.email !== user.email)
        : [...prevSelected, user]
    );
  };

  const handleCreateGroup = async () => {
    if (!groupName) {
      alert('Chat name required');
      return;
    }

    const userIds = selectedUsers.map((user: any) => user._id);
    const data = { users: JSON.stringify(userIds), name: groupName };

    try {
      const res :any= await axios.post(`${apiUrl}/api/chat/group`, data, { withCredentials: true });
      setExistingChats((prevChats: any) => [...prevChats, res.data.data]);
      closeModal();
    } catch (error) {
      console.log("Error in creating group:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <input
          type="text"
          placeholder="Chat Name"
          onChange={(e) => setGroupName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <input
          type="text"
          placeholder="Add User"
          value={search}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <div className="space-y-2">
          {users.slice(0, 4).map((user: any) => (
            <div
              key={user.email}
              onClick={() => handleUserClick(user)}
              className={`w-full text-center p-2 rounded cursor-pointer font-semibold shadow ${
                selectedUsers.some((u: any) => u.email === user.email)
                  ? 'bg-green-100'
                  : 'bg-white'
              } hover:bg-green-50`}
            >
              {user.name} || {user.email}
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {selectedUsers.map((user: any) => (
            <span
              key={user.email}
              className="bg-green-400 text-white rounded-full px-3 py-1 text-sm font-semibold"
            >
              {user.name}
            </span>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mt-4">
          <button
            onClick={handleCreateGroup}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded transition duration-200"
          >
            Create Chat
          </button>
          <button
            onClick={closeModal}
            className="flex-1 bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition duration-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
