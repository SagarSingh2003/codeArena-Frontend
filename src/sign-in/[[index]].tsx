import { SignIn } from "@clerk/clerk-react";
import { useEffect } from "react";

const SignInPage = () => {

    useEffect(() => {

        const signupElement = document.querySelector('a.cl-footerActionLink')

        if(signupElement) signupElement.removeAttribute('href')
        if(signupElement) signupElement.setAttribute('href' , '</sign-up>')

    } , []) 

  return( 
    <section className="h-screen w-full flex flex-col items-center justify-center">
        <SignIn path="/sign-in" /> 
        <section className=" footer-cl w-[400px] bg-white px-[32px] pb-[20px]"> 
            <span>Don't have an account ? </span> <a href="/sign-up"> signup </a>
        </section>
    </section>
  )

};
 
export default SignInPage;