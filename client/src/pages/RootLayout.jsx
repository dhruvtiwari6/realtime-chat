import { Link, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/root.css'
import { UserContext } from "./userProvider";
import { useContext } from "react";

export function RootLayout() {
    const navigate = useNavigate();
    const {UserAlreadyExist, setUserAlreadyExist, User , setUser} = useContext(UserContext);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:8000/api/chat', { withCredentials: true });
                if (response.data.statusCode === 200) {
                    setUserAlreadyExist(true);
                }

                const res = await axios.get('http://localhost:8000/api/users/getUser', { withCredentials: true });

                // const data = res.data.data;
                console.log("Data ", res.data.data);
                setUser(res.data.data)
            

            //    if( data?.isGroupChat === false){
            //       setUser(data.users[0]);
            //    }else if(data?.isGroupChat === true){
            //       setUser(data.users[data.users.length - 1])
            //    }
               
            //    console.log(User);
                
                
            } catch (error) {
                console.log("get request error:", error);
                navigate('/login');
            }
        };

        fetchData();
    }, []);


    const handleLogout = async () => {
        try {
            await axios.post('http://localhost:8000/api/users/logout', {}, { withCredentials: true });
            setUserAlreadyExist(false);
            navigate('/login');
        } catch (error) {
            console.log("logout error:", error);
        }
    };

    return (
        <div>
            <div style={{ backgroundColor: '#f5f3ff'}}>
                <Link to='/chat' style={{
                    textDecoration: 'none',
                    color: "black",
                    fontSize: "2em",
                    fontWeight : "600",
                    fontFamily:"inherit"
                }}>Chat-App</Link>

                <div style={{ display: 'inline', marginLeft: "60vw" }}>
                    {UserAlreadyExist ? (
                        <button onClick={handleLogout} style={{
                            textDecoration: 'none',
                            color: "black",
                            fontSize: "2em",
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer'
                        }} className = "root-hovering">Logout</button>
                    ) : (
                        <>
                            <Link to='/login' style={{
                                textDecoration: 'none',
                                color: "white",
                                fontSize: "2em",
                                borderRadius: "5px",
                                fontFamily: "cursive",
                                backgroundColor: "#047857",
                            }} className = "root-hovering">Login</Link>
                            <span style={{ margin: '0 8px' }}></span>
                            <Link to='/register' style={{
                              textDecoration: 'none',
                              color: "white",
                              fontSize: "2em",
                              borderRadius: "5px",
                              fontFamily: "cursive",
                              backgroundColor: "#047857",
                            }}  className = "root-hovering">Register</Link>
                        </>
                    )}
                </div>
            </div>
            <Outlet />
        </div>
    );
}
