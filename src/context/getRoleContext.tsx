import { createContext, useEffect, useState } from "react";
import api from "../api"
import { useUser } from "@clerk/clerk-react";

export const RoleContext = createContext(null);

export default function RoleContextProvider({children} : {children : React.ReactNode}){

    const token = import.meta.env.VITE_PLAYGROUND_TOKEN;
    const {user} = useUser();

    console.log(user);
    
    const [userRole ,setUserRole] = useState(null);
    const [refreshRole , setRefreshRole] = useState(0);

    useEffect(() => {
        fetch(`${api}/user/getUser/${user?.emailAddresses[0].emailAddress}`, {
            method : "GET",
            headers: {
                "Authorization" : `Bearer ${token}`,
                "Content-Type" : "application/json" 
            }

        }).then( async (res) => {

            const response = await res.json();
            if(res.status === 200){
                setUserRole(response.data);
            }
        
        })
    }, [user , refreshRole]);
    

    console.log(userRole);
    return (
        <RoleContext.Provider value={{userRole , setRefreshRole}}>
            {children}
        </RoleContext.Provider>
    )
}