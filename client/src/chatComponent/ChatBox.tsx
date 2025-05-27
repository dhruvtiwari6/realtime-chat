import React from 'react';
import SingleChat from './singlechat';
import type { GroupChatModalProps } from '@/GroupChatModel';

export const ChatBox = ({
  SelectedChats,
  handleFetchAgain,
  fetchChats,
  setSelectedChats,
  setExistingChats,
  existingChats,
  closeModal
} :GroupChatModalProps) => {
  return (
    <div className="flex-1 bg-white rounded-lg shadow-md overflow-hidden">
      <SingleChat
        SelectedChats={SelectedChats}
        handleFetchAgain={handleFetchAgain}
        fetchChats={fetchChats}
        setSelectedChats={setSelectedChats}
        setExistingChats={setExistingChats}
        existingChats={existingChats}
        closeModal={closeModal}
      />
    </div>
  );
};