import { useUser , UserButton } from '@clerk/clerk-react';
import dashboard from '../assets/dashboard.svg';
import terminal from '../assets/playground.svg';
import deleteLogo from '../assets/deleteLogo.svg';
import inactiveDelete from '../assets/inactiveDelete.svg';
import { useState , useContext } from 'react';
import Playground from './Playground';
import react from "../assets/react.svg";
import { playgroundDataContext } from '@/context/playgroundData';
import api from '@/api';
import Loading from './Playground-repl/Loading';
import { useToast } from './ui/use-toast';

export default function Dashboard(){

    interface Iplayground {
        "id": string,
        "useremail": string,
        "replId": string,
        "type": string
        "createdAt": string
    };

    const {playgroundData , setRefreshPlayground} =  useContext(playgroundDataContext);
    console.log('playgroundData' , playgroundData);
    
    const {user} = useUser() ;
    const [activeDelete , setActiveDelete] = useState({confirm : false , id : ""});
    const [deleteAction , setDeleteAction] = useState({confirm : false , id : ""});

    const activeStyle = {backgroundColor:"#E7E7E8" , color:"#1b181f" ,};

    const {toast} = useToast();
    const [currentTab , setCurrentTab] = useState<string>("Dashboard")
    console.log(user);

    return(
        <section className="flex flex-row h-screen w-full ">
            <section className="h-full w-[15%] bg-[#F4F4F5] border-r border-r-[#E4E4E7]">
                <h1 className=" h-[5%] pl-[20px] font-semibold text-[20px] pt-[10px]">CodeArena</h1>
                <section  className="h-[95%] flex flex-col gap-2 py-[10px] w-[100%] cursor-pointer text-[14px] text-[#9DACA5] font-semibold">
                    <section style={currentTab === "Dashboard" ? activeStyle : {} } onClick={() => { setCurrentTab('Dashboard')}} className='flex gap-4 py-[10px] rounded-sm items-center hover:bg-[#E7E7E8] w-[100%] px-[30px]  hover:text-[#1B181F] '><img src={dashboard} alt="dashboard"  className='h-[30px]' /> Dashboard</section>
                    <section style={currentTab === "Playground" ? activeStyle : {}} onClick={() => {setCurrentTab("Playground")}} className='flex gap-4 items-center py-[10px] rounded-sm hover:bg-[#E7E7E8] w-[100%] px-[30px]  hover:text-[#1B181F] '><img src={terminal} alt="playground" className='h-[28px]' />Playground</section>
                </section>
            </section>
            <section className="flex flex-col h-full w-[85%] bg-white">
                <section className="w-full h-[6%] border-b border-b-[#E4E4E7] flex items-center justify-end px-[20px]">
                    <UserButton showName/>
                </section>
                <section className="w-full h-[94%] px-[30px]">
                    {currentTab !== "Playground" ?
                    <>
                        <section className=' py-[40px] text-[40px] font-semibold'>
                            Welcome Back {user?.username || user?.firstName || user?.fullName} 👋
                        </section>
                        
                        {playgroundData !== null  && playgroundData.length !== 0? 
                        
                            <>
                                <section className="pt-[0px] font-bold text-[20px] border-b mb-[20px]">
                                    <h4>MANAGE PLAYGROUNDS</h4>
                                </section> 
                                <section className='flex flex-col gap-3 h-[70%] overflow-y-scroll overscroll-contain '>
                                  
                                    {playgroundData.map((playground : Iplayground ) => 
                                        <section className='border rounded-sm hover:border-[#6366F1] flex flex-row items-center justify-between w-[880px] px-[15px]'>
                                            <section className=' flex flex-row items-center justify-start px-[20px]   cursor-pointer min-h-[64px] w-[893px] '>    
                                                <section className="bg-[#ECECEE] p-[7px] rounded-sm">
                                                        <img src={react} alt="react-playground" className="h-[20px] "/>
                                                </section>
                                                <section className='flex flex-col justify-start px-[20px]'>
                                                    <span>Resume your {playground.type} project <span className='text-[#9D9CA5]'>{playground.replId}</span></span>
                                                    <span className='text-[14px] text-[#9D9CA5]'>Created on {playground.createdAt}</span>
                                                </section> 
                                            </section> 
                                            <section className='cursor-pointer' 
                                            
                                            onClick={ async() => {
                                                setDeleteAction({confirm : true , id : playground.id});
                                                const actionComplete = await deletePlayground(playground.replId , playground.useremail );
                                                 
                                                if(actionComplete){
                                                    setDeleteAction({confirm : false , id : ""});
                                                    setRefreshPlayground((c : number ) => c + 1)
                                                    toast({
                                                        title : "playground deleted successfully ✔",
                                                    })
                                                }else{
                                                    toast({
                                                        title : "Deletion failed ❌",
                                                        description: "Please try again !",
                                                      })
                                                }
                                            }} 
                                            
                                            onMouseOver={() => {
                                                
                                                setActiveDelete({confirm : true , id : playground.id})
                                            
                                            }} 
                                            
                                            onMouseOut={() => {
                                               
                                                setActiveDelete({confirm : false , id : ""})
                                                
                                            }} >
                                                {deleteAction.confirm && deleteAction.id === playground.id ? 
                                                 <Loading /> : 
                                                 <>
                                                        <img src={deleteLogo} alt="delete playground" className='w-[30px]' style={activeDelete.confirm && activeDelete.id === playground.id ? {display: "block"} : {display: "none"}}/>
                                                        <img src={inactiveDelete} alt="delete playground" className='w-[30px] hover:hidden' style={activeDelete.confirm && activeDelete.id === playground.id ? {display: "none"} : {display: "block"}} />
                                                 </>}
                                            </section>
                                        </section>
                                    )}
                                </section>
                                
                            </>
                        
                        : 
                            null
                        }
                    </>
                    : 
                    <Playground />}
                </section>
            </section>
        </section>
    )
}


async function deletePlayground(replId : string , useremail : string) : Promise<boolean> {

    try{
        const res = await fetch(`${api}/user/delete-playground/${replId}/${useremail}`, {
            method : "DELETE",
            headers: {
                "authorization" : import.meta.env.VITE_BEARER_TOKEN
            }
        });
    
        if(res.status === 200){
            return true; 
        }else{
            return false;
        }
    }catch(err){
        return false;
    }

}