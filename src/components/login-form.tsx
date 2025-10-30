"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Eye, EyeOff, Mail, Lock } from "lucide-react"
import { FormEvent } from "react";

import { useChat } from "@/app/store/Chatinfo";
import { Spinner } from "@/components/ui/spinner"

import { GoogleLogin } from "@react-oauth/google";


export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"form">) {
  
  const { login, isLoggingIn, googleLogin } = useChat();
  
  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    login(formData);
  };

  return (
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      
      <div className="flex flex-col items-center gap-2 text-center max-[425px]:m-4 m-2">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your credentials to login to your account
        </p>
      </div>

      <div className="grid gap-6 max-[425px]:gap-8">
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>
          
            <InputGroup>
                  <InputGroupInput 
                    id="email" 
                    type="email" 
                    placeholder="you@example.com" 
                    required 
                    value={formData.email}
                    disabled={isLoggingIn}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}

                  />
            
                  <InputGroupAddon >
                    <Mail size={18}/>
                 </InputGroupAddon>
            
            </InputGroup>
        </div>

        {/* Password with toggle */}
        <div className="grid gap-3">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* <a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a> */}
          </div>


          <InputGroup>
              <InputGroupInput 
                 id="password"
                 type={showPassword ? "text" : "password"}
                 placeholder="**********"
                 required
                 value={formData.password}
                 disabled={isLoggingIn}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
          
                <InputGroupAddon >
                  <Lock size={18} />
                 </InputGroupAddon>
    
                 <InputGroupAddon align="inline-end">
          
                 <Tooltip>
                     <TooltipTrigger asChild>
                 <InputGroupButton
                    onClick={() => setShowPassword((prev) => !prev)}
                   >
                     {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                  </InputGroupButton>
    
                  </TooltipTrigger>
                    <TooltipContent>
                      <p>{showPassword ? "Hide Password" : "Show Password" }</p>
                    </TooltipContent>
                  </Tooltip>
    
                  </InputGroupAddon>
                 </InputGroup>

        </div>


        <Button type="submit" disabled={isLoggingIn} className="w-full bg-green-600 hover:bg-green-700">
        {isLoggingIn ? (
          <Spinner className="mx-auto" />
        ): (
          <span>
            Login
          </span>
        )}
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        <GoogleLogin
                  onSuccess={googleLogin}
                  onError={() => console.log("Login Failed")}
                />
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <a href="/Sign-up" className="underline underline-offset-4 hover:text-green-600">
          Sign up
        </a>
      </div>
    </form>
  )
}
