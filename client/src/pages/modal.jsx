import React, { useState } from 'react';
import '../styles/modal.css';
import axios from 'axios';

const Modal = ({ CloseModal, setExistingChats }) => { // Corrected prop destructuring
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [groupName, setGroupName] = useState("");

  const handleSearchUser = async (searchTerm) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/users?search=${searchTerm}`, { withCredentials: true });
      setUsers(response.data.data);
    } catch (error) {
      console.error('Error fetching users: ', error);
    }
  };

  const handleChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    handleSearchUser(value);
  };

  const handleUserClick = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.some((u) => u.email === user.email)
        ? prevSelected.filter((u) => u.email !== user.email)
        : [...prevSelected, user]
    );
  };

  const handleCreateGroup = async () => {
    if (groupName.length === 0) {
      alert('Chat name required');
      return;
    }

    const userIds = selectedUsers.map(user => user._id);
    const data = { users: JSON.stringify(userIds), name: groupName };
    
    try {
      const res = await axios.post("http://localhost:8000/api/chat/group", data, { withCredentials: true });
      console.log(res);
      setExistingChats(prevChats => [...prevChats, res.data.data]);
      CloseModal();
    } catch (error) {
      console.log("Error in creating group: ", error); // Fixed typo from err to error
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <input
          type="text"
          placeholder="Chat Name"
          style={{
            display: 'block',
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          onChange={(e) => setGroupName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Add User"
          value={search}
          style={{
            display: 'block',
            marginBottom: '10px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc'
          }}
          onChange={handleChange}
        />

        <div className="user-list">
          {users.slice(0, 4).map((user) => (
            <div
              key={user.email}
              onClick={() => handleUserClick(user)}
              style={{
                backgroundColor: selectedUsers.some((u) => u.email === user.email) ? "#d1fae5" : "#fff",
                width: "370px",
                height: "25px",
                borderRadius: "4px",
                boxShadow: "0px 0px 5px black",
                margin: "5px auto",
                textAlign: "center",
                fontFamily: "cursive",
                fontWeight: "bold",
                cursor: 'pointer'
              }}
            >
              {user.name} || {user.email}
            </div>
          ))}
        </div>

        <div>
          {selectedUsers.length > 0 && selectedUsers.map((user) => (
            <span
              key={user.email}
              style={{
                display: 'inline-block',
                backgroundColor: '#4ade80',
                color: '#fff',
                borderRadius: '12px',
                padding: '5px 10px',
                margin: '5px',
                fontSize: '14px',
                fontWeight: 'bold'
              }}
            >
              {user.name}
            </span>
          ))}
        </div>

        <div>
          <button
            onClick={handleCreateGroup}
            style={{
              backgroundColor: '#64748b',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: "16px",
              width: "160px",
            }}
          >
            Create Chat
          </button>

          <button
            onClick={CloseModal}
            style={{
              backgroundColor: '#64748b',
              color: 'white',
              padding: '10px 20px',
              borderRadius: '4px',
              border: 'none',
              cursor: 'pointer',
              fontSize: "16px",
              width: "160px",
              marginLeft: "32px"
            }}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
