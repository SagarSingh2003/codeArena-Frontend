import { SocketContext } from '@/context/socketContext';
import { Terminal } from '@xterm/xterm';
import "@xterm/xterm/css/xterm.css";
import { useContext, useEffect,  useRef,  useState } from 'react';
import { Socket, io } from 'socket.io-client';

export default function AddTerminal({playgroundType , playgroundName  , sockett} : {playgroundType : string , playgroundName : string , sockett : object}){

    const [socket ,setSocket] = useState(sockett);
    const [data , setData] = useState("");
    const terminalRef = useRef();
    const terminal = new Terminal({cursorBlink : true , convertEol : true});


    useEffect(() => {    
            
            
            terminal.onData((data) => { 

                    socket.emit("execute" , String(data) , playgroundName , playgroundType);
                    console.log("sending request");

            }) 

            socket.emit("execute" , "\r"  , playgroundName , playgroundType);

            socket.on("output" , (msg) => {
                console.log("output recieved");
                console.log(msg , "output");
                terminal.write(`${msg}`);
            })
            
            socket.on("file-provided" , (data) => {
              console.log(data);
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
        
            // @ts-ignore
            terminal.open(terminalRef.current);


    } , [])

    
    return(
        // @ts-ignore 
        <div id="terminal" ref={terminalRef} className=' h-full w-full bg-[black] overflow-scroll  ' >
        </div>
    )
}