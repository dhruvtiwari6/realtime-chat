import "../styles/modal.css";
import { useState, useContext } from "react";
import axios from "axios";
import { UserContext } from "./userProvider";

const GroupChatModel = ({
  closeModal,
  SelectedChats,
  handleFetchAgain,
  fetchChats,
  setSelectedChats,
  setExistingChats,
}) => {
  const [groupName, setGroupName] = useState("");
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { User } = useContext(UserContext);
  console.log("user", User);

  console.log("selected chat : ", SelectedChats);

  const handleUserClick = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.email === user.email)
        ? prevSelected.filter((u) => u.email !== user.email)
        : [...prevSelected, user]
    );
  };

  const handleSearchUser = async (searchTerm) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/users?search=${searchTerm}`,
        { withCredentials: true }
      );

      // Filter out users who are already in the SelectedChats
      const filteredUsers = response.data.data.filter(
        (user) =>
          !SelectedChats.users.some(
            (existingUser) => existingUser._id === user._id
          )
      );

      setUsers(filteredUsers);
    } catch (error) {
      console.error("Error fetching users: ", error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearchUser(value);
  };

  const handleRemoveUser = async (UserId) => {
    try {
      await axios.put(
        "http://localhost:8000/api/chat/groupRemove",
        {
          chatId: SelectedChats._id,
          userId: UserId,
        },
        { withCredentials: true }
      );

      // Update the UI state to reflect the removed user
      setSelectedChats((prevChats) => ({
        ...prevChats,
        users: prevChats.users.filter((user) => user._id !== UserId),
      }));

      handleFetchAgain(); // Refresh the chat data

      console.log("User removed successfully");
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleRenameGroup = async () => {
    const data = { chatId: SelectedChats._id, chatName: groupName };

    if (groupName === "") {
      return alert("Group name required");
    }

    try {
      const res = await axios.put(
        "http://localhost:8000/api/chat/groupRename",
        data,
        { withCredentials: true }
      );
      console.log("Group renamed successfully:", res.data.data); // Clear success message
      setSelectedChats(res.data.data);
      setExistingChats((chat) => (chat._id === SelectedChats._id) ? {...chat ,name: groupName}: chat)
      handleFetchAgain();
      closeModal();
    } catch (error) {
      console.error("Error renaming group:", error); // Use console.error for error handling
    }
  };

  const handleLeaveGroup = async () => {
    try {
      await axios.put(
        "http://localhost:8000/api/chat/groupRemove",
        {
          chatId: SelectedChats._id,
          userId: User,
        },
        { withCredentials: true }
      );

      closeModal();
    } catch (error) {
      console.log("error in leaving group : ", error);
    }
  };

  const handleSelectedUsers = async () => {
    // Make sure to filter out users who are already in SelectedChats
    const newUsers = selectedUsers.filter(
      (selectedUser) =>
        !SelectedChats.users.some(
          (existingUser) => existingUser._id === selectedUser._id
        )
    );


    if (newUsers.length === 0) {
      return alert("No new users to add to the group");
    }

    try {
      // Send request to add new users to the group
      const requests = newUsers.map((user) =>
        axios.put(
          "http://localhost:8000/api/chat/groupAdd",
          {
            chatId: SelectedChats._id,
            userId: user._id,
          },
          { withCredentials: true }
        )
      );

      // Await all requests to complete
      await Promise.all(requests);

      // Optionally, refetch the chat data or update the state to reflect the new users
 // Assuming this function fetches the latest chat data
      setExistingChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === SelectedChats._id
            ? { ...chat, users: [...chat.users, ...newUsers] }
            : chat
        )
      );
      setSelectedChats(prevChats => ({...prevChats, users : [...prevChats.users, ...newUsers]}));

      
      handleFetchAgain();
      setSelectedUsers([]); 
      closeModal();
    } catch (error) {
      console.error("Error adding users to group:", error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div>
          {SelectedChats.users.map((user) => (
            <span
              key={user._id}
              style={{
                display: "inline-block",
                backgroundColor: "#06b6d4",
                color: "#fff",
                borderRadius: "12px",
                padding: "5px 10px",
                margin: "5px",
                fontSize: "14px",
                fontWeight: "bold",
                cursor : "pointer"
              }}
              onClick={() => handleRemoveUser(user._id)}
            >
              {user.name} || {user.email} ( X )
            </span>
          ))}
        </div>

        <div style={{ display: "flex" }}>
          <input
            type="text"
            placeholder="Rename Group"
            style={{
              display: "block",
              marginBottom: "10px",
              padding: "8px",
              borderRadius: "4px",
              border: "1px solid #ccc",
            }}
            onChange={(e) => setGroupName(e.target.value)}
          />

          <button
            style={{ width: "80px", fontSize: "16px", height: "32px" }}
            onClick={handleRenameGroup}
          >
            Change
          </button>
        </div>

        <input
          type="text"
          placeholder="Add User"
          value={search}
          style={{
            display: "block",
            marginBottom: "10px",
            padding: "8px",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
          onChange={handleChange}
        />

        <div className="user-list">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.email}
              onClick={() => handleUserClick(user)}
              style={{
                backgroundColor: selectedUsers.some(
                  (u) => u.email === user.email
                )
                  ? "#d1fae5"
                  : "#fff",
                width: "370px",
                height: "25px",
                borderRadius: "4px",
                boxShadow: "0px 0px 5px black",
                margin: "5px auto",
                textAlign: "center",
                fontFamily: "cursive",
                fontWeight: "bold",
                cursor: "pointer",
                color: "black",
                fontSize: "16px",
              }}
            >
              {user.name} || {user.email}
            </div>
          ))}
        </div>

        <div>
          {selectedUsers.length > 0 &&
            selectedUsers.map((user) => (
              <span
                key={user.email}
                style={{
                  display: "inline-block",
                  backgroundColor: "#4ade80",
                  color: "#fff",
                  borderRadius: "12px",
                  padding: "5px 10px",
                  margin: "5px",
                  fontSize: "14px",
                  fontWeight: "bold",
                }}
              >
                {user.name}
              </span>
            ))}
        </div>

        <div>
          <button
            onClick={handleSelectedUsers}
            style={{
              backgroundColor: "#64748b",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              width: "160px",
            }}
          >
            Update Group Chat
          </button>

          <button
            onClick={closeModal}
            style={{
              backgroundColor: "#64748b",
              color: "white",
              padding: "10px 20px",
              borderRadius: "4px",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              width: "160px",
              marginLeft: "32px",
            }}
          >
            Close
          </button>
        </div>

        <button
          style={{
            backgroundColor: "red",
            height: "32px",
            fontSize: "12px",
          }}
          onClick={handleLeaveGroup}
        >
          Leave Group
        </button>
      </div>
    </div>
  );
};

export default GroupChatModel;
