"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { InputGroup, InputGroupAddon, InputGroupInput, InputGroupButton } from "@/components/ui/input-group";
import { Tooltip, TooltipContent, TooltipTrigger, } from "@/components/ui/tooltip"
import { Eye, EyeOff, UserRound, Mail, Lock} from "lucide-react"

import { toast } from "react-hot-toast";
import { Spinner } from "@/components/ui/spinner"
import { useChat } from "@/app/store/Chatinfo";
import { FormEvent } from "react";

import { GoogleLogin } from "@react-oauth/google";

export function SignUpForm({
  className,
  ...props
}: React.ComponentProps<"form">) {

  const { signup, isSigningUp, googleLogin } = useChat();

  const [showPassword, setShowPassword] = useState(false)

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });


  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (formData.password.length < 6) return toast.error("Password must be at least 6 characters");

    return true;
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = validateForm();

    if (success === true) signup(formData);
  };

  return (
    // Added the onsubmit handle on thi s
    <form className={cn("flex flex-col gap-6", className)} {...props} onSubmit={handleSubmit}>
      <div className="flex flex-col items-center gap-2 text-center max-[425px]:m-4 m-2">
        <h1 className="text-2xl font-bold">Create an account</h1>
        <p className="text-muted-foreground text-sm text-balance">
          Enter your details to sign up
        </p>
      </div>

      <div className="grid gap-6 max-[425px]:gap-8">
        
        {/* Name */}
        <div className="grid gap-3">
          <Label htmlFor="name">Name</Label>

            <InputGroup>
              <InputGroupInput 
                id="name" 
                type="text" 
                placeholder="John Doe" 
                required 
                value={formData.fullName}
                disabled={isSigningUp}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />

                <InputGroupAddon >
                  <UserRound size={18}/>
                </InputGroupAddon>

            </InputGroup>
        </div>

        {/* Email */}
        <div className="grid gap-3">
          <Label htmlFor="email">Email</Label>

          <InputGroup>
          <InputGroupInput 
              id="email" 
              type="email" 
              placeholder="you@example.com" 
              required 
              value={formData.email}
              disabled={isSigningUp}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />

            <InputGroupAddon >
                <Mail size={18}/>
            </InputGroupAddon>

            </InputGroup>

        </div>

        {/* Password */}
        <div className="grid gap-3">
            <Label htmlFor="password">Password</Label> 
            
        <InputGroup>
          <InputGroupInput 
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="**********"
            required
            value={formData.password}
            disabled={isSigningUp}
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
                <p className=" text-[12px]">Password must be at least 6 characters</p>
          </div>


        <Button type="submit" className="w-full bg-green-600 hover:bg-green-700" disabled={isSigningUp}>
          {isSigningUp ? (
            <Spinner className="mx-auto" />
            ): (
              <span>
                Sign Up
              </span>
            )}  
        </Button>

        <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
          <span className="bg-background text-muted-foreground relative z-10 px-2">
            Or continue with
          </span>
        </div>

        {/* Social button */}
        <GoogleLogin
          onSuccess={googleLogin}
          onError={() => console.log("Login Failed")}
        />
        
        
      </div>

      <div className="text-center text-sm">
        Already have an account?{" "}
        <a href="/login" className="underline underline-offset-4 hover:text-green-600">
          Login
        </a>
      </div>
    </form>
  )
}
