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
    // Only redirect if we've finished loading and the user is authenticated
    if (isAuthenticated && !loading) {
      const redirectPath = `/dashboard${LongLink ? `?createNew=${LongLink}` : ""}`;
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, loading, navigate, LongLink]);

  // If still loading or authenticated, show a loading state
  if (loading || isAuthenticated) {
    return <div className="flex justify-center mt-10">Loading...</div>;
  }

  return (
    <div className="flex flex-col items-center gap-10">
      <h1 className="text-3xl font-mono font-bold text-gradient text-[#CAABAB]">
        {searchParams.get("createNew")
          ? "Hold up! let's login first.."
          : "Login/Signup"}
      </h1>
      <Tabs defaultValue="Login" className="w-[400px]">
        <TabsList className="w-full grid grid-cols-2 bg-[#CAABAB] rounded-sm">
          <TabsTrigger value="Login">Login</TabsTrigger>
          <TabsTrigger value="Signup">Signup</TabsTrigger>
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
