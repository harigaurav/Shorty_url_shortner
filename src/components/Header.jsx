import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "./ui/button";
import useFetch from "@/hooks/use-fetch";
import { logout } from "@/db/ApiAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarImage, AvatarFallback } from "./ui/avatar";
import { LinkIcon, LogOut } from "lucide-react";
import { urlState } from "@/context";
import { object } from "yup";
import { BarLoader } from "react-spinners";

const Header = () => {
  // navigate function for routing to auth page part of react router dom
  const { loading, fn: fnLogout } = useFetch(logout);
  const navigate = useNavigate();
  const { user, fnGetUser: fetchUser } = urlState();

  return (
    <>
      <nav className="flex flex-row justify-between items-center px-6">
        <Link className="" to="/">
          <img src="/logo.png" alt="shorty logo" className="h-30" />
        </Link>

        <div>
          {!user ? (
            <Button
              onClick={() => {
                navigate("/auth");
              }}
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:cursor-pointer hover:opacity-80 m-10 rounded-full">
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata.picture}
                    className="object-contain"
                  />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-10 h-30 bg-transparent text-white m-2">
                <DropdownMenuLabel>
                  {user?.user_metadata.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <LinkIcon className="mr-2 h-4 w-4" />
                  My Links
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    fnLogout().then(() => {
                      navigate("/");
                      fetchUser();
                    });
                  }}
                  className="text-red-500"
                >
                  <LogOut className="mr-2 h-4 w-4" /> <span>Log-Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
       {loading && <BarLoader className="mb-4" width={"100%"} color="#36d7b7" />}
    </>
  );
};

export default Header;
