"use client";
import Image from "next/image";
import { useState } from "react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetTrigger } from "@/components/ui/sheet";
import avatar from "@/app/images/avatarpic.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChat } from "@/app/store/Chatinfo";
import { Facebook, X, Linkedin, Instagram, Dribbble } from "lucide-react";

interface UpdatedProfileData {
  fullName: string;
  about: string;
  profilePic?: string;
}

export default function EditProfile() {
  const { authUser, updateUserProfile } = useChat();

  const [fullName, setFullName] = useState(authUser?.fullName || "");
  const [about, setAbout] = useState(authUser?.about || "");
  const [profilePic, setProfilePic] = useState<string>(authUser?.profilePic || avatar.src);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle profile pic upload preview
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePic(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  // Handle profile update
  const handleSave = async () => {
    const formData = new FormData();
    // const updatedData: UpdatedProfileData = { fullName, about };

    // If new picture selected, you can upload it or send base64 (depending on backend)
    if (selectedFile) {
    //   updatedData.profilePic = profilePic; // base64
      formData.append("profilePic", selectedFile);
    }

        formData.append("fullName", fullName);
        formData.append("about", about);
        await updateUserProfile(formData);

    // await updateUserProfile(updatedData); // function from context
  };

  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL; 

  const UserPic = profilePic;

  const imageUrl = UserPic?.startsWith("http")
  ? UserPic
  : `${BASE_URL}${UserPic}`;

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="outline"
          className="hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          Edit Profile
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-[360px] sm:w-[400px] bg-white dark:bg-gray-900 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <SheetHeader>
            <SheetTitle>Profile</SheetTitle>
          </SheetHeader>

          {/* Profile Avatar and Name */}
          <div className="flex flex-col items-center text-center mb-10">
            <div className="relative h-24 w-24 rounded-full bg-gray-100 flex items-center justify-center mb-3 overflow-hidden">
              <Image
                src={profilePic === "" ? avatar.src : imageUrl}
                // src={profilePic}
                alt="Profile"
                width={96}
                height={96}
                className="rounded-full object-cover"
              />
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 w-full text-xs text-white bg-black/50 py-1 cursor-pointer"
              >
                Change
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
          </div>

          {/* Info sections */}
          <div className="space-y-5 text-sm text-gray-700 dark:text-gray-300">
            <div className="my-4">
              <p className="font-semibold mb-2">Name</p>
              <Input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
              />
            </div>

            <div className="my-4">
              <p className="font-semibold mb-2">About</p>
              <Input
                type="text"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="Add something about yourself"
              />
            </div>

            <div className="my-4">
              <p className="font-semibold mb-2">Social Links</p>
              <div className="flex items-center gap-3">
                {[Facebook, X, Linkedin, Instagram, Dribbble].map((Icon, idx) => (
                  <a
                    key={idx}
                    href="#"
                    className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                ))}
              </div>
            </div>
          </div>

          <SheetFooter className="mt-8">
            <Button onClick={handleSave} className="w-full bg-green-600 hover:bg-green-700">
              Save Changes
            </Button>
          </SheetFooter>
        </div>
      </SheetContent>
    </Sheet>
  );
}
