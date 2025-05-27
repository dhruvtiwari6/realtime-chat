import React, { createContext , useState} from "react";


export interface userContextType {
    UserAlreadyExist: boolean;
    setUserAlreadyExist:(value : boolean) => void;
    User: any;
    setUser:(user : any) => void;
}

export const UserContext= createContext< userContextType | null >(null);

export const UserProvider = ({children}: {children : React.ReactNode}) => {
    const [UserAlreadyExist, setUserAlreadyExist] = useState<boolean>(false);
    const [User ,setUser] = useState(null);

    return (
        <UserContext.Provider value ={{UserAlreadyExist, setUserAlreadyExist , User , setUser}}>
            {children}
        </UserContext.Provider>
    )
}