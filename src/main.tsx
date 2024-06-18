import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from './components/ui/toaster.tsx';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

console.log(PUBLISHABLE_KEY);

if (!PUBLISHABLE_KEY) {
    throw new Error("Missing Publishable Key");
}

ReactDOM.createRoot(document.getElementById('root')!).render(
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
        <App />
        <Toaster />
    </ClerkProvider>

)
