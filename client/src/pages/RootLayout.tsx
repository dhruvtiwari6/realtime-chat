import { Link, Outlet } from "react-router-dom";
import { useEffect, useContext } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import '../styles/root.css'
import { UserContext } from "./userProvider.tsx";

import {
    Menubar,
    MenubarMenu,
    MenubarTrigger,
} from "@/components/ui/menubar"


export function RootLayout() {
    const navigate = useNavigate();
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("UserContext must be used within a UserProvider");
    }
    const { UserAlreadyExist, setUserAlreadyExist, setUser } = context;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response: any = await axios.get('http://localhost:8000/api/chat', { withCredentials: true });
                if (response.status === 200) {
                    setUserAlreadyExist(true);
                }

                const res: any = await axios.get('http://localhost:8000/api/users/getUser', { withCredentials: true });

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




    console.log("UserAlreadyExist : ", UserAlreadyExist);

    return (
        <div>
            <Menubar className="flex justify-between w-full">
                <div className="flex gap-4">
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link to="/chat">Chat App</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                </div>
                

                {UserAlreadyExist ? ( <MenubarMenu>
                        <MenubarTrigger>
                            <Link to="/logout">logout</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                ) : (
                <div className="flex gap-4 ml-auto">
                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link to="/login">Login</Link>
                        </MenubarTrigger>
                    </MenubarMenu>

                    <MenubarMenu>
                        <MenubarTrigger>
                            <Link to="/register">Register</Link>
                        </MenubarTrigger>
                    </MenubarMenu>
                </div>
                )}
            </Menubar>
            <Outlet />
        </div>
    );
}
