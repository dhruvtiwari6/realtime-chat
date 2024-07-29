import { IoAddOutline } from "react-icons/io5";
import "../styles/myChat.css";
import { useState, useEffect, useContext } from "react";
import axios from "axios";
import Modal from "../pages/modal";
import { UserContext } from "../pages/userProvider";

export const MyChats = ({
  setSelectedChats,
  existingChats,
  setExistingChats,
  fetchChats,
  handleFetchAgain,
}) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedChat, setSelectedChat] = useState(null);
  const {User} = useContext(UserContext)

  console.log("existingChats", existingChats);

  const CloseModal = () => setShowModal(false);

  // Initial fetch of chats
  useEffect(() => {
    handleFetchAgain();
  }, []);




  const handleNewGroupChat = () => {
    setShowModal(true);
  };

  const handleSelectChat = (chat) => {
    setSelectedChat(chat._id); // Update the selected chat ID
    setSelectedChats(chat); // Call the passed prop to set selected chat in parent
  };

  return (
    <div
      style={{
        backgroundColor: "#64748b",
        width: "450px",
        height: "84vh",
        padding: "0px",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          padding: "12px 8px",
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: "32px",
            fontFamily: "sans-serif",
          }}
        >
          MY-CHATS
        </div>
        <button
          className="group-chat-button"
          style={{ marginTop: "0px", fontSize: "16px", color: "black" }}
          onClick={handleNewGroupChat}
        >
          New Group Chat <IoAddOutline style={{ fontSize: "20px" }} />
        </button>
      </div>

      {existingChats.length > 0 ? (
        <div>
          {existingChats.map((chat) => (
            <div
              key={chat._id}
              className="chat-item"
              onClick={() => handleSelectChat(chat)}
              style={{
                cursor: "pointer",
                backgroundColor:
                  selectedChat === chat._id ? "#2dd4bf" : "#fef2f2",
                color: "black",
                borderRadius: "5px",
                margin: "10px 15px",
                height: "2em",
                fontSize: "24px",
                paddingLeft: "12px",
                fontFamily: "sans-serif",
              }}
            >
              {chat.isGroupChat ? chat.chatName : (chat.users[1]._id === User) ?chat.users[0].name : chat.users[1].name }
            </div>
          ))}
        </div>
      ) : (
        <div style={{ color: "white", padding: "10px" }}>
          No chats available.
        </div>
      )}

      {showModal && (
        <Modal CloseModal={CloseModal} setExistingChats={setExistingChats} />
      )}
    </div>
  );
};
