import { SocketContext } from '@/context/socketContext';
import { Terminal } from '@xterm/xterm';
import "@xterm/xterm/css/xterm.css";
import { useContext, useEffect,  useRef,  useState } from 'react';
import { Socket, io } from 'socket.io-client';

export default function AddTerminal({playgroundType , playgroundName  } : {playgroundType : string , playgroundName : string , socket : object}){

    const [socket ,setSocket] = useState();
    const [data , setData] = useState("");
    const terminalRef = useRef();
    const terminal = new Terminal({cursorBlink : true , convertEol : true});


    useEffect(() => {

            const socket = io("http://localhost:3000");
            setSocket(socket);
    
            
            
            terminal.onData((data) => { 

                    socket.emit("execute" , String(data) , playgroundName , playgroundType);
                    console.log("sending request");

            }) 

            socket.emit("execute" , "\r"  , playgroundName , playgroundType);
            socket.on("output" , (msg) => {
                console.log(msg , "output");
                terminal.write(`${msg}`);
            })

            return () => {
                socket.disconnect();
            }
    
    } , [])


    useEffect(() => {
      
        function beforeUnload(e: BeforeUnloadEvent) {
          
          socket.disconnect();
  
        }
      
        window.addEventListener('beforeunload', beforeUnload);
      
        return () => {
          window.removeEventListener('beforeunload', beforeUnload);
        };
  
      }, []);

    useEffect(() => {
        
            // let isSpaceKey = false;
            
            // @ts-ignore
            terminal.open(terminalRef.current);

            //@ts-ignore
            // terminalRef.current?.addEventListener('keydown' , (event) => {if(event.code === "Space") { isSpaceKey = true}})
            
            
    } , [])

    
    return(
        // @ts-ignore 
        <div id="terminal" ref={terminalRef} className=' h-full w-full bg-[black] overflow-scroll  ' >
        </div>
    )
}