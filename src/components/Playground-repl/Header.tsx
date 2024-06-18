import { UserButton } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import save from "../../assets/save.svg";
import Loading from "./Loading";

export default function Header({startSaving , socket , playgroundName , playgroundType} : {startSaving : any , socket : any , playgroundName : string , playgroundType : string}){
 
    const navigate = useNavigate();

    return(
        <section className="flex items-center justify-between   w-full h-[60px] font-bold  bg-[#131313] text-white px-[20px]">
             <span onClick={()=> {

                    socket.emit("saveplayground" , playgroundName , playgroundType , (data) => {
                        if(data === "project_saved"){
                            
                            navigate('/');
                    
                        }
                    });

                    navigate('/')
                
                }} className="cursor-pointer">CodeArena</span>
             <span className="px-[10px] py-[5px] bg-[#535cda] hover:bg-[#4338ca] flex flex-row gap-1 items-center justify-center rounded-sm cursor-pointer "> {startSaving ? <Loading />  : 
             <>
                <img src={save} alt="run" width="20px" /> <span>Save</span>
             </> } 
             </span>
            <UserButton></UserButton>
        </section>
    )
}