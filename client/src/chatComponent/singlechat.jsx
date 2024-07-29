import React, { useEffect, useState, useContext } from "react";
import { FaEye } from "react-icons/fa";
import axios from "axios";
import GroupChatModel from "../pages/GroupChatModel";
import { UserContext } from '../pages/userProvider';
import ScrollableFeed from 'react-scrollable-feed';


import { io } from 'socket.io-client';


const endPoint = "http://localhost:8000";
let socket ,selectedChatCompare;


const SingleChat = ({
  SelectedChats,
  handleFetchAgain,
  fetchChats,
  setSelectedChats,
  setExistingChats,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [SocketConnected, setSocketConnected] = useState(false);
  // const [IsTyping , setIsTyping] = useState(false);

  const { User } = useContext(UserContext);



  const closeModal = () => {
    setShowModal(false);
    console.log(SelectedChats.chatName);
  };

  const handleShowGroupChatModal = () => {
    setShowModal(true);
  };

  const fetchMessages = async () => {
    if (!SelectedChats) return;

    try {
      const res = await axios.get(`http://localhost:8000/api/message/${SelectedChats._id}`, { withCredentials: true });
      setMessages(res.data.data);

      socket.emit("join chat" ,SelectedChats._id);
    } catch (error) {
      console.log("Error in fetching all the messages of this chat: ", error);
    }
  };

  useEffect( ()=> {
    socket = io(endPoint);
    socket.emit("setup" , User);
    socket.on("connection", ()=> setSocketConnected(true));
    // socket.on("typing" , ()=> setIsTyping(true));
    // socket.on("stop typing" , ()=> setIsTyping(true));

   }, [])

  useEffect(() => {
    fetchMessages();

    selectedChatCompare = SelectedChats;
  }, [SelectedChats]);


  useEffect(()=> {
    socket.on("message received", (newMessageReceived)=> {
      if(!selectedChatCompare|| selectedChatCompare._id !== newMessageReceived.Chat._id){
        //give notify
      }else {
        setMessages([...messages , newMessageReceived])
      }
    })
  })




  const sendMessage = async (e) => {
    if (e.key === "Enter" && !e.shiftKey && newMessage) {
      e.preventDefault(); // Prevents adding a new line
      try {
        const res = await axios.post('http://localhost:8000/api/message',
          {
            content: newMessage,
            chatId: SelectedChats._id
          },
          { withCredentials: true }
        );

        setNewMessage("");
        socket.emit('new message', res.data.data);
        setMessages(prevMessages => [...prevMessages, res.data.data]);

        console.log(res.data.data);

      } catch (error) {
        console.log("Error in sending message on the frontend: ", error);
      }
    }
  };

//for connectioin estaablished between client and server


  const typingHandler = (e) => {
    setNewMessage(e.target.value);
    autoResizeTextarea(e.target);
  };

  const autoResizeTextarea = (textarea) => {
    textarea.style.height = 'auto'; // Reset height
    textarea.style.height = `${textarea.scrollHeight}px`; // Set to the scroll height
  };

  return (
    <div
      style={{
        width: "1000px",
        height: "100%",
        backgroundColor: "#64748b",
        fontFamily: "cursive",
        color: "white",
        fontSize: "2em",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {SelectedChats ? (
        SelectedChats.isGroupChat === true ? (
          <div
            style={{
              backgroundColor: "#cbd5e1",
              color: "black",
              display: "flex",
              justifyContent: "space-around",
            }}
          >
            <div>{SelectedChats.chatName}</div>
            <div onClick={handleShowGroupChatModal}>
              <FaEye />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              justifyContent: "space-between",
              padding: "10px",
              height: "80vh"
            }}
          >
            <div
              style={{
                backgroundColor: "#cbd5e1",
                color: "black",
                textAlign: "center",
                padding: "0px",
              }}
            >
              {(SelectedChats.users[1]._id === User) ? SelectedChats.users[0].name : SelectedChats.users[1].name}
            </div>

            <div
              className="messages"
              style={{
                flex: "1",
                overflowY: "auto",
                marginBottom: "10px",
                padding: "10px",
                color: "black",
              }}
            >
              <ScrollableFeed>
                {messages && messages.map((m) => (
                  
                    <div key = {m._id}
                      style={{
                        backgroundColor: m.sender._id === User ? "#81C784" : "#FFCDD2",
                        color: "black",
                        padding: "8px",
                        borderRadius: "10px",
                        maxWidth: "45%",
                        marginTop: "8px",
                        marginBottom: "8px",
                        marginLeft: m.sender._id === User ? "0px" : "70%",
                      }}
                    >
                      {m.content}
                  </div>
                ))}
              </ScrollableFeed>
            </div>

            <textarea
              placeholder="Enter message"
              value={newMessage}
              style={{
                width: "100%",
                marginLeft: "0px",
                marginTop: "auto",
                padding: "10px",
                boxSizing: "border-box",
                border: "none",
                fontFamily: "inherit",
                fontSize: "24px",
                resize: "none", // Prevent manual resizing
                overflow: "hidden", // Hide scrollbar
                height : "2em"
              }}
              rows={1} // Start with one line
              onKeyDown={sendMessage}
              onChange={typingHandler}
            />
          </div>
        )
      ) : (
        <div
          style={{
            textAlign: "center",
            position: "relative",
            top: "45%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            color: "black",
          }}
        >
          Click the User to Chat with
        </div>
      )}

      {showModal && (
        <GroupChatModel
          closeModal={closeModal}
          SelectedChats={SelectedChats}
          handleFetchAgain={handleFetchAgain}
          fetchChats={fetchChats}
          setSelectedChats={setSelectedChats}
          setExistingChats={setExistingChats}
        />
      )}
    </div>
  );
};

export default SingleChat;
