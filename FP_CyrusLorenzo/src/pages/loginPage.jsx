import { GalleryVerticalEnd } from "lucide-react"

import { LoginForm } from "@/components/login-form"
import Navbar from "@/sections/navbar"

  const riseInClass ="opacity-0 translate-y-[18px] [animation:rise-in_0.82s_cubic-bezier(0.22,1,0.36,1)_forwards] motion-reduce:animate-none motion-reduce:opacity-100 motion-reduce:translate-y-0";


export default function LoginPage() {
  return (
    <div>

        <div className="block mb-4">
          <Navbar />
        </div>


         <div className="mt-30">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        
        <div className={`flex flex-1 items-center justify-center ${riseInClass}`}>
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      {/* <div className="relative hidden bg-muted lg:block  mt-20 h-[900px]">
        <img
          src="/assets/blockchainopt.png"
          alt="Image"
          className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] 
                    dark:grayscale"
        />
      </div> */}
    </div>
    </div>
   
  )
}
