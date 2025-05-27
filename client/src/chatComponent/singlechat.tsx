import  { useEffect, useState, useContext } from 'react';
import { Send, Settings } from 'lucide-react';
import axios from 'axios';
import io from 'socket.io-client';
import { UserContext } from '../pages/userProvider';
import GroupChatModal from '../pages/GroupChatModel';
import type { GroupChatModalProps } from '@/GroupChatModel';

const ENDPOINT = "http://localhost:8000";
let socket: any, selectedChatCompare :any;

const SingleChat = ({
  SelectedChats,
  handleFetchAgain,
  fetchChats,
  setSelectedChats,
  setExistingChats,
  existingChats
} : GroupChatModalProps) => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState<string[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");
  const [ , setSocketConnected] = useState(false);
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("SingleChat must be used within a UserProvider");
  }
  const { User } = context;

  useEffect(() => {
    socket = io(ENDPOINT);
    socket.emit("setup", User);
    socket.on("connection", () => setSocketConnected(true));
  }, []);

  useEffect(() => {
    fetchMessages();
    selectedChatCompare = SelectedChats;
  }, [SelectedChats]);

  useEffect(() => {
    socket.on("message received", (newMessageReceived : any) => {
      if (!selectedChatCompare || selectedChatCompare._id !== newMessageReceived.Chat._id) {
        // Handle notification
      } else {
        setMessages([...messages, newMessageReceived]);
      }
    });
  });

  const fetchMessages = async () => {
    if (!SelectedChats) return;

    try {
      const res: any = await axios.get(
        `http://localhost:8000/api/message/${SelectedChats._id}`,
        { withCredentials: true }
      );
      setMessages(res.data.data);
      socket.emit("join chat", SelectedChats._id);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  const sendMessage = async (e : any) => {
    if (e.key === "Enter" && !e.shiftKey && newMessage.trim()) {
      try {
        const res :any = await axios.post(
          'http://localhost:8000/api/message',
          {
            content: newMessage,
            chatId: SelectedChats._id
          },
          { withCredentials: true }
        );

        setNewMessage("");
        socket.emit('new message', res.data.data);
        setMessages([...messages, res.data.data]);
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      {SelectedChats ? (
        <>
          <div className="p-4 border-b flex justify-between items-center bg-white">
            <h2 className="text-xl font-semibold text-gray-800">
              {SelectedChats.isGroupChat
                ? SelectedChats.chatName
                : SelectedChats.users[1]._id === User
                ? SelectedChats.users[0].name
                : SelectedChats.users[1].name}
            </h2>
            {SelectedChats.isGroupChat && (
              <button
                onClick={() => setShowModal(true)}
                className="p-2 text-gray-600 hover:bg-gray-100 rounded-full transition-colors"
              >
                <Settings size={20} />
              </button>
            )}
          </div>

          <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="space-y-4">
              {messages.map((message :any) => (
                <div
                  key={message._id}
                  className={`flex ${
                    message.sender._id === User ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg ${
                      message.sender._id === User
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-800'
                    }`}
                  >
                    {message.content}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex gap-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={sendMessage}
                placeholder="Type a message..."
                className="flex-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                rows={1}
              />
              <button
                onClick={() => sendMessage({ key: 'Enter' })}
                className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500">
          Select a chat to start messaging
        </div>
      )}

      {showModal && (
        <GroupChatModal
          closeModal={() => setShowModal(false)}
          SelectedChats={SelectedChats}
          handleFetchAgain={handleFetchAgain}
          fetchChats={fetchChats}
          setSelectedChats={setSelectedChats}
          setExistingChats={setExistingChats}
          existingChats={existingChats}
        />
      )}
    </div>
  );
};

export default SingleChat;