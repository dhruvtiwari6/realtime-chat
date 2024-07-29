import { useState } from "react";
import '../styles/SideDrawer.css';
import { CiSearch } from "react-icons/ci";
import { MdOutlineCancel } from "react-icons/md";
import axios from "axios";


export const SideDrawer = ({handleFetchAgain}) => {
    const [search, setSearch] = useState("");
    const [users, setUsers] = useState([]);

    const openNav = () => {
        document.getElementById("mySidenav").style.width = "250px";
    }

    const closeNav = () => {
        document.getElementById("mySidenav").style.width = "0";
        setUsers([]); // Clear the user list
    }

    const handleAllUsers = async () => {
        if (search === '') {
            alert("Input field is required");
            return;
        }

        try {
            const response = await axios.get(`http://localhost:8000/api/users?search=${search}`, { withCredentials: true });
            setUsers(response.data.data); // Update state with fetched users
            console.log(response.data.data);

        } catch (error) {
            console.log("User find error: ", error);
            alert("Invalid user name");
        }
    }

    const accessChat = async (chattingUserId) => {
        try {
            const res = await axios.post(`http://localhost:8000/api/chat`, { chattingUserId }, { withCredentials: true });
            handleFetchAgain();
            console.log(res);
        } catch (error) {
            console.log("Chat access error: ", error);
            alert("Failed to access chat");
        }
    }

    return (
        <>
            <div className="tooltip" onClick={openNav}>
                <CiSearch className="search-icon" /> Search 
                <span className="tooltip-text">Search users to chat</span>
            </div>

            <div id="mySidenav" className="sideNav">
                <div onClick={closeNav} className="closeNav">
                    <MdOutlineCancel className='cross-symbol' />
                </div>
                <div style={{
                    color: 'white',
                    textAlign: "center",
                    backgroundColor: "#94a3b8",
                    fontWeight: "bold",
                    fontSize: "2em"
                }}>Search User</div>

                <div style={{ display: "inline-block" }}>
                    <input
                        type="text"
                        onChange={(e) => setSearch(e.target.value)}
                        style={{ marginLeft: "15px" }}
                    />
                    <button
                        onClick={handleAllUsers}
                        style={{
                            marginTop: "0px",
                            height: "17px",
                            fontSize: "12px",
                            marginLeft: "20px"
                        }}
                    >Go</button>

                    <ul className="search-user-list" style={{ color: "white", cursor: "pointer" }}>
                        {users.map((user) => (
                            <li
                                key={user._id}
                                style={{ listStyle: "none", margin: "2px" }}
                                onClick={() => accessChat(user._id)}
                            >
                                {user.name} ({user.email})
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
};
