import { useContext, useEffect, useState } from "react";
import folder from "../../../assets/folder.svg";
import arrow from "../../../assets/arrow.svg";
import downarrow from "../../../assets/downarrow.svg";
import { fileContext } from "@/context/fileContext";
import { ActiveTabContext } from "@/context/activeTabContext";



function getFileContent(filename : string , socket : any , playgroundName : string , playgroundType : string , setOpenFiles : any , setActiveTab : any){

    socket.emit("providefile" , playgroundName , playgroundType , filename ,  (content : string) => {
        // @ts-ignore 
        console.log('filename' , filename);
        console.log('content'  , content);
        setOpenFiles((arr : any) => { return arr ? [ ...arr  , {fileName : filename , content : content}] :  [{fileName : filename , content : content}] });
        setActiveTab([{fileName : filename , content : content}]);       
    });
}

export default function DirStructure({fileBrowserContent , socket , playgroundName , playgroundType } : {fileBrowserContent : object , socket : any , playgroundName : string , playgroundType : string}){

    const [openFolders , setOpenFolders ] = useState<string[]>([]);
    // @ts-ignore
    const {openFiles , setOpenFiles} = useContext(fileContext);
    // @ts-ignore 
    const {activeTab , setActiveTab} = useContext(ActiveTabContext);

    useEffect(() => {
    
        console.log(openFiles  , "open files .... from file browser");
    
    } , [openFiles]);
    
    
  

    return <>
         
        <ul className="pl-[10px] text-[13px] box-border">
            {
                Object.keys(fileBrowserContent).map((element) => {
                    
                     
                        // @ts-ignore
                     return ( fileBrowserContent[element] === null ? 
                      <li className="pl-[30px] mt-[5px] p-[3px] cursor-pointer box-border text-[#32d77b] bg-[#161616] hover:bg-[#404040] rounded-sm flex items-center" onClick={ async() => {
                                 
                                    getFileContent(element , socket , playgroundName , playgroundType , setOpenFiles , setActiveTab);

                                 
                       }}>
                        {element}
                      </li> 
                    :    
                       <section  >
                            <span className=" cursor-pointer pl-[15px] mt-[5px] mb-[5px] bg-[#161616] text-[#FFca28] flex gap-1 items-center pt-[5px] box-border " onClick={() => { Boolean((openFolders.filter((folder) => folder === element).length)) ? setOpenFolders((data) => data.filter((folder) => folder !== element)) : setOpenFolders((data) => [...data , `${element}`])}}>
                                {Boolean(openFolders.filter((folder) => folder===element).length) ? <img src={downarrow} alt="" /> : <img src={arrow} alt="" />} <img src={folder} alt="folder" /> {element}
                            </span>
                            <section style={ Boolean((openFolders.filter((folder) => folder === element ).length)) ? {display: "block" , borderLeft: "1px solid #27272a" } : {display: "none"}} >
                                {/* @ts-ignore */}
                                <DirStructure fileBrowserContent={fileBrowserContent[element]} playgroundName={playgroundName} playgroundType={playgroundType} socket={socket} />
                            </section>
                       </section> 
                    )
                })
            }
        </ul>
    </>
}