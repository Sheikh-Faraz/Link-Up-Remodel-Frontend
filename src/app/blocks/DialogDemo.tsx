import { Button } from "@/components/ui/button"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CirclePlus } from "lucide-react"
import { useState, FormEvent } from "react";
import { useChat } from "@/app/store/Chatinfo";

export function DialogDemo() {
  const { addContact } = useChat();
  const [userIdInput, setUserIdInput] = useState("");

const handleAddContact = async (e: FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    if (!userIdInput.trim()) return alert("Please enter a UserId");
    addContact(userIdInput.trim());

  };
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button 
            variant="outline" 
            className="flex items-center border border-gray-300 rounded-md py-2 px-4 font-medium text-sm max-[425px]:text-xs max-[315px]:mt-4"
            >
            <CirclePlus className="size-4"/>
              Add Contact
            </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">

        <form onSubmit={handleAddContact}>
          <DialogHeader>
            <DialogTitle>Add new contact</DialogTitle>
            <DialogDescription>
                Enter the UserId of the contact you want to add. 
                <span className="block pt-1">
                  Example: SGH-15A-456987
                </span>
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 my-2">
            <div className="grid gap-3">
              <Label htmlFor="name-1">UserId</Label>
              <Input
                id="userId"
                value={userIdInput}
                onChange={(e) => setUserIdInput(e.target.value)}
              />
              {/* <Input id="name-1" name="name" /> */}
              {/* <Input id="name-1" name="name" defaultValue="Pedro Duarte" /> */}
            </div>
            {/* <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div> */}
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <DialogClose asChild>
              <Button 
                variant="outline" 
                type="submit"   
                className= "bg-green-600 hover:bg-green-700"
              >
                <span className="text-white">
                  Add
                </span>
              </Button>
            </DialogClose>
          </DialogFooter>
      </form>
        </DialogContent>
    </Dialog>
  )
}
