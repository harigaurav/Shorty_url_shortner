import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const LandingPage = () => {
  // state for long url input field  and navigate function for routing to auth page with long url as query parameter.
  const [long_url, setLong_url] = useState("");
  const navigate = useNavigate();

  // function for after submit form
  const handleShorten = (e) => {
    e.preventDefault();
    if (long_url) navigate(`/auth?createNew=${long_url}`);
  };

  return (
    <div className="flex flex-col items-center justify-start min-h-[60vh] pt-0">
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold flex flex-col items-center gap-2 text-center w-full px-2 mt-0">
        <span
          className="block animate-slide-in-left"
          style={{
            animation: "slide-in-left 1s cubic-bezier(0.77,0,0.175,1) forwards",
            background: "linear-gradient(90deg, #fff 30%, #a16a6a 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          Simplify your links
        </span>
        <span
          className="block animate-slide-in-right"
          style={{
            animation:
              "slide-in-right 1s 0.3s cubic-bezier(0.77,0,0.175,1) forwards",
            background: "linear-gradient(90deg, #a16a6a 0%, #fff 70%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
            color: "transparent",
          }}
        >
          amplify your clicks.
        </span>
      </h1>
      <style>{`
        @keyframes slide-in-left {
          0% { opacity: 0; transform: translateX(-80vw); }
          100% { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          0% { opacity: 0; transform: translateX(80vw); }
          100% { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      {/* input form for long url */}
      <form
        onSubmit={handleShorten}
        className="w-full max-w-xl flex flex-col sm:flex-row items-center justify-start gap-3 mt-20 border-2 rounded-lg p-4 bg-black/60"
      >
        <Input
          className="flex-1 min-w-0 h-12 text-base px-3 py-2 rounded-md border border-gray-400 focus:outline-none focus:ring-2 focus:ring-primary"
          type="url"
          placeholder="Paste your long URL here..."
          value={long_url}
          onChange={(e) => setLong_url(e.target.value)}
        />
        <Button
          className="w-full sm:w-auto h-12 px-6 mt-2 sm:mt-0 border-1 text-base font-semibold"
          type="submit"
        >
          ENTER
        </Button>
      </form>
    </div>
  );
};

export default LandingPage;
