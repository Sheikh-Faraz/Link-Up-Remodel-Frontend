import { SignUpForm } from "@/components/signup-form"
import SignUpImg from "@/app/images/Sign-Up-img.png"
import LinkUpLogo from "@/app/images/Linkup-logo.png"
import Image from "next/image";

export default function SignUpPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted">
      {/* <div className="flex flex-col gap-4 p-6 md:p-10 border-2 border-red-600"> */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a className="flex items-center gap-2 font-medium">
            {/* <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md"> */}
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              <Image 
                src={LinkUpLogo.src} 
                alt={"Logo"}
                width={35}
                height={35}
               />
            </div>
            Link Up.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <SignUpForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block m-auto">
        <Image
          src={SignUpImg.src}
          alt="Image"
          height={0}
          width={500}
        />
      </div>
    </div>
  )
}
