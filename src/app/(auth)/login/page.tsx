// import { GalleryVerticalEnd } from "lucide-react"
import { LoginForm } from "@/components/login-form"
import LinkUpLogo from "@/app/images/Linkup-logo.png"
import loginImg from "@/app/images/Login-Side-img-white.png"
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10 bg-muted">
      {/* <div className="flex flex-col gap-4 p-6 md:p-10 border-2 border-red-600"> */}
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <div className="text-primary-foreground flex items-center justify-center rounded-md">
              {/* <GalleryVerticalEnd className="size-4" /> */}
              <Image 
                              src={LinkUpLogo.src} 
                              alt={"Logo"}
                              width={35}
                              height={35}
                             />
            </div>
            Link-Up.
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="relative hidden lg:block m-auto">
        <Image
          src={loginImg.src}
          alt="Image"
          height={0}
          width={500}
        />
      </div>
    </div>
  )
}
