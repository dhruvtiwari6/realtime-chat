import { useState, useEffect } from 'react';
import { SideDrawer } from "../chatComponent/SideDrawer";
import { MyChats } from "../chatComponent/MyChats";
import { ChatBox } from "../chatComponent/ChatBox";
import axios from 'axios';

export function Chat() {
  const [selectedChat, setSelectedChat] = useState("");
  const [existingChats, setExistingChats] = useState([]);


  const apiUrl = import.meta.env.VITE_API_URL;


  const fetchChats = async () => {
    try {
      const res: any = await axios.get(`${apiUrl}/api/chat`, {
        withCredentials: true,
      });
      setExistingChats(res.data.data);
    } catch (err) {
      console.error("Error fetching chats:", err);
    }
  };

  const handleFetchAgain = () => {
    fetchChats();
  };

  useEffect(() => {
    fetchChats();
  }, []);

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <SideDrawer handleFetchAgain={handleFetchAgain} />

      <div className="flex flex-col md:flex-row flex-1 gap-4 p-4 overflow-hidden">
        {/* Chats list */}
        <div className="w-full md:w-1/3 h-1/2 md:h-full overflow-y-auto">
          <MyChats
            setSelectedChats={setSelectedChat}
            existingChats={existingChats}
            setExistingChats={setExistingChats}
            fetchChats={fetchChats}
            handleFetchAgain={handleFetchAgain}
            SelectedChats={selectedChat}
            closeModal={() => {}}
          />
        </div>

        {/* Chat box */}
        <div className="w-full md:w-2/3 h-1/2 md:h-full overflow-y-auto">
          <ChatBox
            SelectedChats={selectedChat}
            handleFetchAgain={handleFetchAgain}
            fetchChats={fetchChats}
            setSelectedChats={setSelectedChat}
            setExistingChats={setExistingChats}
            existingChats={existingChats}
            closeModal={() => {}}
          />
        </div>
      </div>
    </div>
  );
}
