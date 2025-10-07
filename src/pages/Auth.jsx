import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Login from "@/components/Login";
import Signup from "@/components/Signup";
import { urlState } from "@/context";

const Auth = () => {
  const [searchParams] = useSearchParams();
  const LongLink = searchParams.get("createNew");
  const navigate = useNavigate();

  const { isAuthenticated, loading } = urlState();

  useEffect(() => {
    if (isAuthenticated && !loading) {
      const redirectPath = `/dashboard${
        LongLink ? `?createNew=${LongLink}` : ""
      }`;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, LongLink]);

  if (loading || isAuthenticated) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-10 px-4 sm:px-6 md:px-8">
      <h1 className="text-2xl sm:text-3xl font-mono font-bold text-gradient text-[#CAABAB] text-center max-w-xl">
        {LongLink ? "Hold up! let's login first.." : "Login/Signup"}
      </h1>
      <Tabs
        defaultValue="Login"
        className="w-full max-w-sm sm:max-w-md md:max-w-md"
      >
        <TabsList className="w-full grid grid-cols-2 bg-[] rounded-sm">
          <TabsTrigger className="text-[#CAABAB]" value="Login">
            Login
          </TabsTrigger>
          <TabsTrigger className="text-[#CAABAB]" value="Signup">
            Signup
          </TabsTrigger>
        </TabsList>
        <TabsContent value="Login">
          <Login />
        </TabsContent>
        <TabsContent value="Signup">
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;
