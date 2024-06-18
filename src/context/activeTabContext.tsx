import { ReactNode, createContext, useState } from "react";



export const ActiveTabContext = createContext(null);


export default function ActiveTabContextProvider({children} : {children : ReactNode}){
    
    const [activeTab , setActiveTab ]  = useState([]);
    
    // console.log(activeTab , activeTab[0]?.fileName );

    return(
        // @ts-ignore
        <ActiveTabContext.Provider value={{activeTab : activeTab , setActiveTab : setActiveTab}}>
            {children}
        </ActiveTabContext.Provider>
    )   
}