import './App.css'
import {BrowserRouter , Routes , Route, Navigate} from 'react-router-dom'
// import Playground from './components/Playground'
import { SignedIn, SignedOut } from '@clerk/clerk-react'
import Dashboard from './components/Dashboard'
import SignInPage from './sign-in/[[index]]'
import SignUpPage from './sign-up/[[index]]'
import PlaygroundRepl from './components/PlaygroundRepl'
import PlaygroundContextProvider from './context/playgroundData'
import SocketProvider from './context/socketContext'
import FileContextProvider from './context/fileContext'
import ActiveTabContextProvider from './context/activeTabContext'
import SocketContextProvider from './context/socketContext'
import RoleContextProvider from './context/getRoleContext'
import Playground from './components/Playground'



function App() {
  
  return (
      <header>
        <SignedOut>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Navigate to="/sign-in" replace={true} />} ></Route>
              <Route path="/sign-in" element={ <SignInPage/> }></Route>
              <Route path="/sign-up" element={ <SignUpPage />} ></Route>
            </Routes>
          </BrowserRouter>
        </SignedOut>
        <SignedIn>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<SocketContextProvider><PlaygroundContextProvider><RoleContextProvider><Dashboard/></RoleContextProvider></PlaygroundContextProvider></SocketContextProvider>} />
                <Route path="/playground-dashboard" element={<SocketContextProvider><Playground/></SocketContextProvider>} />
                <Route path='/playground' element={<SocketContextProvider><FileContextProvider><ActiveTabContextProvider>< PlaygroundRepl /></ActiveTabContextProvider></FileContextProvider></SocketContextProvider>} />
              </Routes>
          </BrowserRouter>    
        </SignedIn>
      </header>
      
  )
}

export default App
