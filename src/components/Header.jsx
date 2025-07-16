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
      <nav className="flex flex-row justify-between items-center px-6 animate-fade-in">
        <Link className="transform hover:scale-105 transition-transform duration-300" to="/">
          <img src="/logo.png" alt="shorty logo" className="h-30 animate-bounce-slow" />
        </Link>

        <div>
          {!user ? (
            <Button
              onClick={() => {
                navigate("/auth");
              }}
              className="transform hover:scale-105 transition-all duration-300 hover:shadow-lg animate-slide-in-right"
            >
              Login
            </Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className="hover:cursor-pointer hover:opacity-80 m-10 rounded-full transform hover:scale-110 transition-all duration-300 animate-fade-in-up">
                <Avatar className="ring-2 ring-transparent hover:ring-white transition-all duration-300">
                  <AvatarImage
                    src={user?.user_metadata.picture}
                    className="object-contain"
                  />
                  <AvatarFallback>GM</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-10 h-30 bg-transparent text-white m-2 animate-slide-down">
                <DropdownMenuLabel className="animate-fade-in">
                  {user?.user_metadata.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  onClick={() => navigate("/dashboard")}
                  className="hover:bg-white/10 transition-colors duration-200"
                >
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
                  className="text-red-500 hover:bg-red-500/10 transition-colors duration-200"
                >
                  <LogOut className="mr-2 h-4 w-4" /> <span>Log-Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className="mb-4 animate-pulse" width={"100%"} color="white" />}
      
      <style>{`
        @keyframes fade-in {
          0% { opacity: 0; }
          100% { opacity: 1; }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(50px); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes fade-in-up {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-down {
          0% { opacity: 0; transform: translateY(-10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        @keyframes bounce-slow {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-10px); }
          60% { transform: translateY(-5px); }
        }
        .animate-fade-in { animation: fade-in 0.8s ease-out; }
        .animate-slide-in-right { animation: slide-in-right 0.6s ease-out; }
        .animate-fade-in-up { animation: fade-in-up 0.5s ease-out; }
        .animate-slide-down { animation: slide-down 0.3s ease-out; }
        .animate-bounce-slow { animation: bounce-slow 3s infinite; }
      `}</style>
    </>
  );
};

export default Header;
