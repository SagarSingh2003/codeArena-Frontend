import { useUser } from "@clerk/clerk-react";
import { ReactNode, createContext, useEffect, useState } from "react";
import api from "../api";



export const playgroundDataContext = createContext(null);

export default function PlaygroundContextProvider ({children} : {children : ReactNode}) {

        const Token = import.meta.env.VITE_PLAYGROUND_TOKEN

        const [playgroundData ,setPlaygroundData] = useState(null);
        const {user} = useUser();
        const email = user?.emailAddresses[0].emailAddress;
        const [refreshPlayground , setRefreshPlayground] = useState(0);

        useEffect(() => {
            fetch(`${api}/user/get-playground-list/${email}` , {
                method : "GET", 
                headers : {
                    "Authorization" : `Bearer ${Token}`
                }
            }).then(async (res) => {
                const playgrounds = await res.json();
                setPlaygroundData(playgrounds.playground.reverse());
            })  
        } , [email , refreshPlayground])
    
    
    
        return (
            // @ts-ignore 
            <playgroundDataContext.Provider value={{playgroundData : playgroundData , setRefreshPlayground: setRefreshPlayground}}>
                {children}
            </playgroundDataContext.Provider>
        )
}