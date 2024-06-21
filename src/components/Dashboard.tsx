import { useUser , UserButton } from '@clerk/clerk-react';
import dashboard from '../assets/dashboard.svg';
import terminal from '../assets/playground.svg';
import deleteLogo from '../assets/deleteLogo.svg';
import inactiveDelete from '../assets/inactiveDelete.svg';
import React, { useState , useContext, useEffect, ReactNode, useRef } from 'react';
import Playground from './Playground';
import react from "../assets/react.svg";
import { playgroundDataContext } from '@/context/playgroundData';
import api from '@/api';
import Loading from './Playground-repl/Loading';
import { useToast } from './ui/use-toast';
import CourseCard from './DashboardComponents/CourseCard';
import { useNavigate } from 'react-router-dom';
import { RoleContext } from '@/context/getRoleContext';

export default function Dashboard(){

    interface Iplayground {
        "id": string,
        "useremail": string,
        "replId": string,
        "type": string
        "createdAt": string
    };

    interface Role {
        role : string,
        usename? : string, 

    }

    const token = import.meta.env.VITE_PLAYGROUND_TOKEN;
    
    const {userRole , setRefreshRole} = useContext(RoleContext);
    const [userInfo , setUserInfo] = useState<object>();
    const [role , setRole] = useState<string>();
    const [currentPage , setCurrentPage] = useState(1);
    const [showPage , setShowPage] = useState <ReactNode>(null);
    const [loggedIn , setLoggedIn] = useState(false);
    const {playgroundData , setRefreshPlayground} =  useContext(playgroundDataContext);


    console.log(userRole , "userRole");

    console.log('playgroundData' , playgroundData);
    
    const {user} = useUser() ;
    console.log(user);
    const navigate = useNavigate();
    const nameRef = useRef();
    const expRef = useRef();
    const [activeDelete , setActiveDelete] = useState({confirm : false , id : ""});
    const [deleteAction , setDeleteAction] = useState({confirm : false , id : ""});

    const activeStyle = {backgroundColor:"#E7E7E8" , color:"#1b181f" ,};

    const {toast} = useToast();
    const [currentTab , setCurrentTab] = useState<string>("Dashboard")
    console.log(user);

    const color = ["890607" , "510000", "cc0000"  , "b70000",
        "510000",
        "890607",
        "3d0000",
        "280000",
        '280000',
        '140000', "000000"
        ]
    
    function generateNewBoxes (){
        let counter = 0;
        return new Array(2650).fill(0).map(() => {
            let col;
            let rand;
            counter += 1;
            if(counter < 250){
                col = color.slice(0 , 7);
                rand = Math.floor(Math.random() * 7);
            }else if(counter >= 250 && counter < 750){
                col = color.slice(3 , 11);
                rand = Math.floor(Math.random() * 9);
            }else if(counter >= 750){
                col = color.slice(5 , 12);
                rand = Math.floor(Math.random() * 7);
            }


            return <div id="div-spot" className='glow z-10'  style={{backgroundColor : `#${col[rand]}` , width: "1.5px" , height: "1.5px" , margin: "0.4px"}} ></div>
        })
    }

    const [arrofBoxes , setArrOfBoxes] = useState([]);
    const [showAnimation , setShowAnimation] = useState(false);

    useEffect(() => {

        let intervalId : any;

        if(showAnimation){
                    
            intervalId = setInterval(() => {
                setArrOfBoxes((val) => {
                return generateNewBoxes()
                })
            } , 500);
        }

        return () => {
            setArrOfBoxes([]);
            clearInterval(intervalId);
        }
    } , [showAnimation])

    useEffect(() => {
        
        if(user){
            setLoggedIn(true);
        }else{
            setLoggedIn(false);
        }

    } , [user])


    console.log(userInfo);

    useEffect(() => {


        if(userInfo && userInfo.role === "teacher"){
            fetch(`${api}/teacher/createTeacher`, {
                method : "POST",
                headers: {
                    "Authorization" : `Bearer ${token}`,
                    "Content-Type" : "application/json" 
                },
                body : JSON.stringify({
                    useremail : user?.emailAddresses[0].emailAddress ,
                    name : userInfo.name,
                    exp : userInfo.experience
                })
    
            }).then( async (res) => {

                const response = await res.json();
                if(response.status === 200){
                    setRefreshRole((c : number) => c + 1);
                }
            
            })
        }else if(userInfo && userInfo.role === "learner"){
            fetch(`${api}/learner/createLearner`, {
                method : "POST",
                headers: {
                    "Authorization" : `Bearer ${token}`,
                    "Content-Type" : "application/json" 
                },
                body : JSON.stringify({
                    useremail : user?.emailAddresses[0].emailAddress ,
                    name : user?.username || user?.fullName || user?.firstName
                })
    
            }).then( async (res) => {

                const response = await res.json();
                if(res.status === 200){
                    setTimeout(() => {
                        setRefreshRole((c : number) => c + 1);
                    } , 4000);
                }
            
            })
        }

    } , [userInfo]);

    useEffect(() => {

    switch(currentPage) {
        case 1 : 
            setShowPage(
    
            <section className='bg-[white]'>
                What Role do you want on CodeArena ?
                <button onClick={() => {
                    setRole('learner');
                    setCurrentPage((c) => c + 1);
                }}>
                    Learner
                </button>
                <button onClick={() => {
                    setRole('teacher');
                    setCurrentPage((c) => c + 1);
                }}>
                    Teacher
                </button>
            </section>

            ) 

            break;
        case 2 : 
            setShowPage(
                
                
                role === "teacher" ?
                
                <section>   
                    <section>
                        <p>Enter your Name :</p> 
                        <input type="text" ref={nameRef}/>
                    </section>
                    <section>
                        <p>Enter your professional Experience</p>
                        <input type="text" ref={expRef}/>
                    </section>
                    <section onClick={() => {
                        if (nameRef.current.value && expRef.current.value) setUserInfo({role : "teacher" , name : nameRef.current.value , experience : expRef.current.value })
                    }}>
                        {"->"}
                    </section>
                </section>
                
                :

                null
                
            )

            break;
    }

    } , [currentPage])

    useEffect(() => {

        if(role === "learner"){
            console.log("learner");
            setUserInfo({role : "learner"});
        }
    } , [role])

    if(user && !userRole){
        return(
            <>
                {showPage}
            </>
        )
    }


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
                {
                loggedIn ? 
                    <section className="w-full h-[6%] border-b border-b-[#E4E4E7] flex items-center justify-end px-[20px]">
                        <UserButton showName/>
                        <span>Teach on CodeArena</span>
                    </section>

                    :
                    
                    <section className="w-full h-[6%] border-b border-b-[#E4E4E7] flex items-center gap-2 justify-end px-[20px]">
                        <span onClick={() => {
                            navigate('/sign-in')
                        }}>Login</span>
                        <span onClick={() => {
                            navigate('/sign-up')
                        }}>SignUp</span>
                        <span >Teach on CodeArena</span>
                    </section>
                }
                <section className="w-full h-[94%] px-[30px]">
                    {currentTab !== "Playground" ?
                    <>
                        {loggedIn ? 

                            <section>
                            
                            {userRole  && userRole.role === "teacher" ? 

                                <section className=' py-[40px] text-[40px] font-semibold'>
                                    Welcome {userRole.username} , what would you like to Teach today? 
                                </section> 
                                
                                : 

                                <section className=' py-[40px] text-[40px] font-semibold'>
                                    Welcome Back {user?.username || user?.firstName || user?.fullName} , let's continue our coding journey !
                                </section>

                            } 

                            </section>
                        :

                         null

                        }
                        <section>
                            <input type="text" placeholder='search for courses' className='p-[10px]'/>
                        </section>
                        <section className='grid grid-cols-5 gap-2'>
                            <CourseCard  rating={3}/>
                            <CourseCard  rating={3}/>
                            <CourseCard rating={3}/>
                            <CourseCard rating ={3}/>
                            <CourseCard rating={4}/>

                            <div className='h-[180px] bg-[black] flex flex-row items-center justify-center flex-wrap  papa-div ' style={{width: "230px"}} onMouseOver={() => {
                                setShowAnimation(true);
                            }} onMouseOut={() => {
                                setShowAnimation(false);
                            }

                            }>      
                                        <section className='tick-section w-full h-full flex flex-col items-center  justify-center z-20'>
                                            <h1 className='thickk 20px ' style={{fontWeight: "50px"}}  >Ruby
                                            </h1>
                                            
                                        </section>
                                        
                                        {...arrofBoxes}
                                        
                                    
                            </div>
                            
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