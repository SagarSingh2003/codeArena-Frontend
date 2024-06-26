import { useUser } from "@clerk/clerk-react";
import react from "../assets/react.svg";
import {v4 as uuid} from "uuid" ;
import api from "@/api";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { playgroundDataContext } from "@/context/playgroundData";
import Loading from "./Playground-repl/Loading";
import { SocketContext } from "@/context/socketContext";


interface UserInfo {
    email: string;
    replId: string;
    type: string;
    createdAt: string;
}

export default function Playground(){

    const [getState , setGetState] = useState(null);
    const [playgroundType , setPlaygroundType] = useState("react");
    const [playgroundName , setPlaygroundName] = useState();
    const [createState , setCreateState] = useState(null)
    const {playgroundData} = useContext(playgroundDataContext);
    const {user} = useUser() ;
    const socket = useContext(SocketContext); 
    const navigate = useNavigate();
    
    useEffect(() => {

        if(createState === "done" ) { 
            setCreateState(null);
            navigate('/playground', {state : {playgroundType : playgroundType , playgroundName : playgroundName}});
        }

            
    }, [createState]);

    useEffect(() => {
        if(getState === "done"){
            setGetState(null);
            navigate("/playground" , {state : {playgroundType : playgroundType , playgroundName : playgroundName}})
        }
    } , [getState])


    return(
        <>
            <section className="pt-[30px] font-bold text-[20px] border-b">
                <h4>CREATE PLAYGROUNDS</h4>
            </section>
            <section className="text-[14px] pt-[10px] ">
                Coding playgrounds on CodeArena are powered by Xterm and start within a few seconds. Practice coding while learning for free.
            </section>
            <section onClick={() => {

                const replId = uuid();
                
                setPlaygroundType("react");
                setPlaygroundName(replId);
                setCreateState("not-done");
                const date = new Date();

                createRepl({email : user?.emailAddresses[0].emailAddress! , replId : String(replId) , type : "react" , createdAt : date.toLocaleDateString() } , setCreateState , socket);

            }} 
            
            className="w-[364px] h-[70px] border rounded-sm flex flex-row items-center justify-start px-[20px] mt-[20px] hover:border-[#6366F1] cursor-pointer ">
                <section className="bg-[#ECECEE] p-[7px] rounded-sm">
                    <img src={react} alt="react-playground" className="h-[20px] "/>
                </section>
                <section className="flex flex-col justify-start px-[20px]"> 
                    <section>
                        React
                    </section>
                    <section className="text-[14px] text-[#9D9CA5]">
                        React playground using vite
                    </section>
                </section>
                <section className="pl-[30px]">
                    {createState === "not-done" ? <Loading /> : null}
                </section>
            </section>
            {playgroundData !== null  && playgroundData.length !== 0? 
                        
                        <section>
                            <section className="pt-[30px] font-bold text-[20px] border-b mb-[20px]">
                                <h4>RESUME PLAYGROUND</h4>
                            </section> 
                            <section className='flex flex-col gap-3 h-[70%] overflow-y-scroll overscroll-contain'>
                                {/* @ts-expect-error */}
                                {playgroundData.map((playground : Iplayground ) => 
                                    <section onClick={() => {

                                        setPlaygroundName(playground.replId);
                                        setGetState({done :"not-done" , id : playground.replId});
                                        getPlayground(playground , setGetState , socket);
                                    
                                    }}
                                    
                                    className='border rounded-sm flex flex-row items-center justify-start px-[20px]  hover:border-[#6366F1] cursor-pointer min-h-[64px] w-[893px] box-border'>
                                         
                                         <section className="bg-[#ECECEE] p-[7px] rounded-sm">
                                                <img src={react} alt="react-playground" className="h-[20px] "/>
                                        </section>
                                        <section className='flex flex-col justify-start px-[20px]'>
                                            <span>Resume your {playground.type} project <span className='text-[#9D9CA5]'>{playground.replId}</span></span>
                                            <span className='text-[14px] text-[#9D9CA5]'>Created on {playground.createdAt}</span>
                                        </section> 

                                        <section className="pl-[30px]">
                                            {getState && getState.done === "not-done" && getState.id === playground.replId ? <Loading /> : null}
                                        </section>
                                    </section> 
                                )}
                            </section>
                        </section>
                    
                    : 
                        null
                    }
        </>
    )
}



function createRepl( userInfo : UserInfo  , setCreateState : any , socket : any) {
    
  

    socket.emit("create_container" , userInfo.replId , userInfo.type , "sagarsingh2003/codearena-server:v0.0.2" , (msg : boolean) => {
        const  containerCreated = msg;
        
        if(containerCreated){
            socket.emit("connect-to-playground" , userInfo.replId);
            
            setTimeout(() => {
                fetch(api + "/user/create-playground" , {
                    method : "POST",
                    headers : {
                        "Content-Type" : "application/json",
                        "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWdhciI6InNpbmdoIiwiYXM7bGRramZhO2xzamRrZmxqa2FzZGxmamthcyI6ImFkbGZramFzZDtsa2ZqYTtsc2RqZmFsIn0.NYirkr9paUfUq0UEAe4eE_g2Nn6Dde6Wyu0A3pNONo8"
                    },
                    body: JSON.stringify(userInfo)
                }).then((res) => {
                    console.log(res.status);
                    setCreateState("done");
                });
            } , 2000);
    
        }
    
    })

  
  }

function getPlayground(playgroundData : any , setGetState : any , socket : any){
    console.log(playgroundData);

    socket.emit("create_container" , playgroundData.replId , playgroundData.type , "sagarsingh2003/codearena-server:v0.0.2" , (msg : boolean) => {
        const  containerCreated = msg;
        
        if(containerCreated){
            socket.emit("connect-to-playground" , playgroundData.replId);
            
            setTimeout(() => {
                                  
                    fetch(api + "/user/get-playground" , {
                        method: "GET",
                        headers: {
                            "Authorization" : "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzYWdhciI6InNpbmdoIiwiYXM7bGRramZhO2xzamRrZmxqa2FzZGxmamthcyI6ImFkbGZramFzZDtsa2ZqYTtsc2RqZmFsIn0.NYirkr9paUfUq0UEAe4eE_g2Nn6Dde6Wyu0A3pNONo8",
                            "replId" : `${playgroundData.replId}`
                        }
                    }).then((res) => {
                        console.log(res.status);
                        if(res.status === 200){
                            setGetState("done");  
                        }
                    })
                    
            } , 2000);
    
        }
    
    })
}