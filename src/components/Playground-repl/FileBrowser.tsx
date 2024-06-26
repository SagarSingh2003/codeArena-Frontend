import { useContext } from "react";
import files from "../../assets/files.svg";
import DirStructure from "./FileBrowserComponent/DirStructure"; 
import { SocketContext } from "@/context/socketContext";


export default function FileBrowser({fileBrowserContent , playgroundType , playgroundName } : {fileBrowserContent : object  , playgroundType : string , playgroundName : string }){

    const socket = useContext(SocketContext);
    
    if(fileBrowserContent){

        return(
            <section className="flex flex-row h-full ">
                <section className=" w-[15%] pt-[30px]  border-r border-r-[#27272a]">
                    <img src={files} alt="" className="w-[50px] h-[30px] px-[10px] border-l border-l-[white]" />
                </section>
                <section className="w-[85%]">
                    <section className="flex items-center py-[5px] px-[20px] text-[14px] cursor-default bg-[#27272a]">
                        EXPLORER
                    </section>
                    <section className="flex flex-col gap-2 max-w-[80%]  mt-[10px] ml-[30px]">
                        {/* @ts-ignore */}
                        <>
                            < DirStructure fileBrowserContent={fileBrowserContent} socket={socket} playgroundType={playgroundType} playgroundName={playgroundName} />
                        </>
                    </section>
                </section>

            </section>
        )
    }
}