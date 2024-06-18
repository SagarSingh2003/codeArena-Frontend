import { SignUp } from "@clerk/clerk-react";
 
function SignUpPage() {
  return (
    <section className="h-screen w-full flex flex-col items-center justify-center">
        <SignUp path="/sign-up" />
        <section className=" footer-cl w-[400px] bg-white px-[32px] pb-[20px]"> 
            <span>Don't have an account ? </span> <a href="/sign-in"> signin </a>
        </section>
    </section>
  );
}

export default SignUpPage;