import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import { Editor } from '@monaco-editor/react';
import Header from './Playground-repl/Header';
import AddTerminal from './Playground-repl/Terminal';

import { Suspense, lazy, useContext, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import cross from "../assets/crosss.svg";
import refresh_btn from "../assets/refresh_btn.svg";

const FileBrowser = lazy(() => import("./Playground-repl/FileBrowser"));
import Loading from "./Playground-repl/Loading";
import { fileContext } from "@/context/fileContext";
import { ActiveTabContext } from "@/context/activeTabContext";
import { SocketContext } from "@/context/socketContext";



export default function PlaygroundRepl () {

    const iframeRef = useRef();
    const [fileBrowserContent , setFileBrowserContent] = useState({});
    const location = useLocation();
    const [counter , setCounter] = useState(0);
    const {playgroundType , playgroundName} = location.state;
    // @ts-ignore 
    const { openFiles , setOpenFiles} = useContext(fileContext)
    // @ts-ignore 
    const {activeTab , setActiveTab} = useContext(ActiveTabContext); 
    const [refresh , setRefreshComponent] = useState(0);
    const [startSaving , setStartSaving] = useState(false);
    const editorRef = useRef();

    console.log("playgroundName ...." ,playgroundName);
    console.log("playgroundType ....." , playgroundType);

    useEffect(() => {
      console.log(openFiles , "from playground repl");
    } , [openFiles]);

    const socket = useContext(SocketContext);

    useEffect(() => {
      console.log(activeTab , "app.tsx");    
      setRefreshComponent((c) => c + 1);
    } , [activeTab]);

    useEffect(() => {
      
      if(counter === 0 && socket){

        socket.emit("execute" , `cd ${playgroundName}/${playgroundType}-starter-code/ \r\n`  , playgroundName , playgroundType);
        socket.emit("execute" , `npm install \r\n` , playgroundName , playgroundType);
        socket.emit("execute" , `npm run dev \r\n` , playgroundName ,playgroundType);
        setCounter((c) => c + 1);

      }

    }, [fileBrowserContent , socket]);

    useEffect(() => {

      if(playgroundName && playgroundType && socket){
        
        socket.emit("providefile" , playgroundName , playgroundType ,  "App.tsx" ,  (content : string) => {
          // @ts-ignore 
          console.log("again");
          setActiveTab([{fileName : "App.tsx" , content : content}]);  
          setOpenFiles([{fileName : "App.tsx" , content : content}]);
        });

      }


    } , [socket])


    
    
    useEffect(() => {
      
      function beforeUnload(e: BeforeUnloadEvent) {
        
        socket.emit("saveplayground" , playgroundName , playgroundType , (data : string) => {
          console.log(data);
        });

      }
    
      window.addEventListener('beforeunload', beforeUnload);
    
      return () => {
        window.removeEventListener('beforeunload', beforeUnload);
      };

    }, [activeTab]);


    useEffect(() => {

      if(startSaving && socket){

        
        let saveFile = new Object();

        
        console.log(activeTab[0].fileName , activeTab[0].content , "active tab changes ");

        //@ts-ignore
        saveFile[`${activeTab[0].fileName}`] = activeTab[0].content; 
      
        
        socket.emit("update-file" , playgroundName , playgroundType , [saveFile] , () => {
          setStartSaving(false);
        });
        
      }

    } , [startSaving]);

    useEffect(() => {
      if(playgroundName && playgroundType && socket){

        //@ts-expect-error
        socket.emit("file_browser" , playgroundType , playgroundName , ({directory_structure}) => {
            console.log(directory_structure , "directory_structure");
            setFileBrowserContent(directory_structure);
        })  

      }

    } , [socket])

    useEffect(() => {

        document.addEventListener('keydown', function(event) {

          // Check if Ctrl+S is pressed

          if (event.ctrlKey && event.key === 's') {

              event.preventDefault(); // Prevent default browser behavior (saving the page)

          // Call your action or function here
              console.log(editorRef);
              setStartSaving(true);
          }

        });
    
      } , []);
 
    return( 

        <section className='h-[100%] w-screen bg-[#131313]' >

        <Header startSaving={startSaving} socket={socket} playgroundName={playgroundName} playgroundType={playgroundType} />
        
        <ResizablePanelGroup direction='horizontal' className=' border border-[#2B2B2B] border-b-0 min-w-screen   bg-[#131313] text-white'>
          
            <ResizablePanel defaultSize={20} className=" border border-[#2b2b2b] border-b-0 min-h-[92vh]">
            

              { fileBrowserContent && Object.keys(fileBrowserContent).length ?
                         
                     <FileBrowser fileBrowserContent={fileBrowserContent} playgroundName={playgroundName} playgroundType={playgroundType} ></FileBrowser> 
                : 

                <section className=" w-full h-screen flex items-center justify-center">
                  <Loading />
                </section>

                }
            </ResizablePanel>
         
            <ResizableHandle />
         
            <ResizablePanel defaultSize={90} className='min-w-[300px]'>
                <ResizablePanelGroup direction='horizontal'>
                  <ResizablePanel defaultSize={60} className="min-w-0">
                      <ResizablePanelGroup  direction="vertical" className='min-w-[400px] min-h-[900px]'>
                            <ResizablePanel defaultSize={65} className='border border-[#2b2b2b] min-h-[300px] '>
                                <section className='flex flex-col h-full w-full bg-[#1e1e1e]' >  
                                  <section className="min-h-[40px] flex flex-row  bg-[#131313]">
                                      {openFiles.length > 0   ? openFiles.map((file : {content : string , fileName : string}) => {
                                        console.log(file , "open ....");
                                        return <section className="px-[10px] flex flex-row  h-full text-white border cursor-default border-[#27272a] items-center justify-around gap-1">
                                          <span className="hover:bg-[#27272a] cursor-pointer" onClick={() => {
                                              
                                              // @ts-ignore 
                                              const newOpenFilesList = openFiles.filter((element) => {
                                                  return element.fileName !== file.fileName 
                                              });
                                              console.log(newOpenFilesList , "open files list");
                                              setOpenFiles(newOpenFilesList);
                                              
                                              console.log(newOpenFilesList[newOpenFilesList.length - 1]);
                                              setActiveTab([newOpenFilesList[0]]);
                                          
                                          }}>
                                              <img src={cross} alt="close file"  className="h-[25px]"/>
                                          </span>   
                                          <span className="text-[14px]" onClick={() => {
                                            setActiveTab([{fileName : file.fileName , content : file.content}])
                                          }} style={activeTab[0]?.fileName !== file.fileName ? {color:"#525254"} : {}}>
                                            {file.fileName}
                                          </span>
                                        </section>
                                      }) 
                                      
                                      : 
                                      
                                      null}
                                    </section>
                                   {( activeTab && activeTab?.length !== 0 ) ? 
                                  //@ts-ignore
                                  <Editor ref={editorRef} defaultLanguage="" theme='vs-dark' value={activeTab[0]?.content} onChange={ (e) => {setActiveTab([{fileName : activeTab[0].fileName  , content : e}])}} />   
                                   : 
                                  <Loading />}
                                </section>
                            </ResizablePanel>
                            <ResizableHandle  />
                            <ResizablePanel defaultSize={35} className='border  border-[#2b2b2b] border-b-0 min-h-[300px]'>
                                  <AddTerminal playgroundType={playgroundType} playgroundName={playgroundName} socket={socket}/>
                            </ResizablePanel>             
                        </ResizablePanelGroup>
                  </ResizablePanel>
                  <ResizableHandle />
                  <ResizablePanel defaultSize={40} className='min-w-[100px]'>
                            <section className="w-full h-full">
                                  <section className="w-full h-[30px] flex flex-row box-border m-[10px]">
                                    <section 
                                        onClick={() => {
                                          iframeRef.current.src = "http://172.17.0.2:5555" ;
                                        }}
                                        
                                        className="bg-[#27272a] flex flex-row items-center gap-2 p-[10px] rounded-[5px] ">  
                                        <button className="text-[13px]" > 
                                          Refresh
                                        </button>
                                        <img src={refresh_btn} alt="refresh" className=" w-[20px] h-[20px]" />
                                    </section>
                                  </section>
                                  <iframe ref={iframeRef} src="http://172.17.0.2:5555"  className="w-full h-full" ></iframe>
                            </section>
                  </ResizablePanel>
                </ResizablePanelGroup>
              </ResizablePanel> 
           
        </ResizablePanelGroup>
      </section>
    )   
}



