import { useState } from 'react';
import { SideDrawer } from "../chatComponent/SideDrawer";
import { MyChats } from "../chatComponent/MyChats";
import { ChatBox } from "../chatComponent/ChatBox";
import axios from 'axios';

export function Chat() {
  const [selectedChat, setSelectedChat] = useState("");
  const [existingChats, setExistingChats] = useState([]);

  const fetchChats = async () => {
    try {
      const res :any = await axios.get("http://localhost:8000/api/chat", {
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

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      <SideDrawer handleFetchAgain={handleFetchAgain} />
      
      <div className="flex flex-1 gap-4 p-4 overflow-hidden">
        <MyChats
          setSelectedChats={setSelectedChat}
          existingChats={existingChats}
          setExistingChats={setExistingChats}
          fetchChats={fetchChats}
          handleFetchAgain={handleFetchAgain}
          SelectedChats={selectedChat}
          closeModal={()=>{}}
        />
        
        <ChatBox
          SelectedChats={selectedChat}
          handleFetchAgain={handleFetchAgain}
          fetchChats={fetchChats}
          setSelectedChats={setSelectedChat}
          setExistingChats={setExistingChats}
          existingChats={existingChats}
          closeModal={()=> {}}
        />
      </div>
    </div>
  );
}