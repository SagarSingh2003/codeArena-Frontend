import { ReactNode, createContext, useState } from "react";

export const fileContext = createContext(null);

export default function FileContextProvider({children} : {children : ReactNode}){

    const [openFiles , setOpenFiles] = useState([]);
    console.log(typeof openFiles , "openfiles in context");
    return (
        // @ts-ignore 
        <fileContext.Provider value={{openFiles : openFiles , setOpenFiles : setOpenFiles}} >
            {children}
        </fileContext.Provider>
    )
}