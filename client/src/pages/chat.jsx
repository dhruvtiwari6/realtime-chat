import { SideDrawer } from "../chatComponent/SideDrawer"
import { MyChats } from "../chatComponent/MyChats"
import { ChatBox } from "../chatComponent/ChatBox"
import { useEffect, useState } from "react";
import axios from 'axios'

export function Chat() {
      const [SelectedChats , setSelectedChats] = useState("");
      const [existingChats, setExistingChats] = useState([]);

      const fetchChats = async () => {
        try {
          const res = await axios.get("http://localhost:8000/api/chat", {
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
   <div >
           <SideDrawer handleFetchAgain = {handleFetchAgain}/>

          <div style ={{
            display : "flex",
            justifyContent : "space-between"
            ,padding : "10px"
          }}>
            
            <div> <MyChats setSelectedChats = {setSelectedChats} existingChats = {existingChats} setExistingChats = {setExistingChats}  fetchChats = {fetchChats} handleFetchAgain = {handleFetchAgain}/></div>
            <div> <ChatBox  SelectedChats = {SelectedChats} handleFetchAgain = {handleFetchAgain} fetchChats = {fetchChats} setSelectedChats = {setSelectedChats} setExistingChats = {setExistingChats} /></div> 
               
          </div>

   </div>
)
}