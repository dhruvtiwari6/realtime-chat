import React, { useState, useEffect, useContext } from 'react';
import { Users, Plus } from 'lucide-react';
import { UserContext } from '../pages/userProvider';
import Modal from '../pages/modal';

import type { GroupChatModalProps } from '../pages/GroupChatModel';

export const MyChats = ({
  setSelectedChats,
  setExistingChats,
  fetchChats,
  handleFetchAgain,
  SelectedChats,
  existingChats,
} : GroupChatModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("MyChats must be used within a UserProvider");
  }
  const { User } = context;

  useEffect(() => {
    handleFetchAgain();
  }, []);

  const handleSelectChat = (chat :any) => {
    setSelectedChats(chat);
  };

  return (
    <div className="w-80 bg-white rounded-lg shadow-md flex flex-col">
      <div className="p-4 border-b">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Chats</h2>
          <button
            onClick={() => setShowModal(true)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
            title="New Group Chat"
          >
            <Plus size={24} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {existingChats.length > 0 ? (
          existingChats.map((chat :any) => (
            <div
              key={chat._id}
              onClick={() => handleSelectChat(chat)}
              className={`p-3 rounded-lg cursor-pointer transition-colors mb-2 ${
                SelectedChats?._id === chat._id
                  ? 'bg-blue-50 border-blue-200'
                  : 'hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Users size={20} className="text-blue-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-800">
                    {chat.isGroupChat
                      ? chat.chatName
                      : chat.users[1]._id === User
                      ? chat.users[0].name
                      : chat.users[1].name}
                  </h3>
                  {chat.isGroupChat && (
                    <p className="text-sm text-gray-500">
                      {chat.users.length} members
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500 mt-4">
            No chats available
          </div>
        )}
      </div>

      {showModal && (
        <Modal
          closeModal={() => setShowModal(false)}
          setExistingChats={setExistingChats}
          SelectedChats={SelectedChats}
          handleFetchAgain={handleFetchAgain}
          fetchChats={fetchChats}
          setSelectedChats={setSelectedChats}
          existingChats={existingChats}
        />
      )}
    </div>
  );
};