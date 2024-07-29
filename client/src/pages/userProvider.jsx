import { createContext , useState} from "react";

export const UserContext= createContext();

export const UserProvider = ({children}) => {
    const [UserAlreadyExist, setUserAlreadyExist] = useState(false);
    const [User ,setUser] = useState(null);



    return (
        <UserContext.Provider value ={{UserAlreadyExist, setUserAlreadyExist , User , setUser}}>
            {children}
        </UserContext.Provider>
    )
}