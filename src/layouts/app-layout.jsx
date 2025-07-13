import Header from "@/components/Header";
import React from "react";
import { Outlet } from "react-router-dom";

const AppLayout = () => {
  return (
    <div className="fixed inset-0 w-full z-0 bg-black overflow-y-auto">
      {/* Scratchy rough texture */}
      <div
        className="absolute inset-0 opacity-40 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(45deg, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 8px, rgba(255,255,255,0.05) 1px, transparent 12px),
            linear-gradient(-30deg, rgba(255,255,255,0.08) 1px, transparent 2px, transparent 15px, rgba(255,255,255,0.04) 1px, transparent 20px),
            linear-gradient(120deg, rgba(255,255,255,0.06) 1px, transparent 3px, transparent 10px, rgba(255,255,255,0.03) 1px, transparent 18px)
          `,
          backgroundSize: "25px 25px, 40px 40px, 35px 35px",
        }}
      />

      {/* Gritty noise pattern */}
      <div
        className="absolute inset-0 opacity-50 pointer-events-none"
        style={{
          backgroundImage: `
            radial-gradient(circle at 15% 35%, rgba(255,255,255,0.2) 0.5px, transparent 1px),
            radial-gradient(circle at 85% 65%, rgba(255,255,255,0.15) 1px, transparent 2px),
            radial-gradient(circle at 45% 85%, rgba(255,255,255,0.1) 0.5px, transparent 1px),
            radial-gradient(circle at 25% 75%, rgba(255,255,255,0.12) 1px, transparent 2px),
            radial-gradient(circle at 75% 25%, rgba(255,255,255,0.08) 0.5px, transparent 1px)
          `,
          backgroundSize:
            "20px 20px, 30px 30px, 25px 25px, 35px 35px, 28px 28px",
        }}
      />

      {/* Heavy grain overlay */}
      <div
        className="absolute inset-0 opacity-30 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-conic-gradient(from 0deg at 50% 50%, rgba(255,255,255,0.1) 0deg, transparent 2deg, rgba(255,255,255,0.05) 4deg, transparent 6deg),
            repeating-radial-gradient(circle at 30% 70%, rgba(255,255,255,0.08) 1px, transparent 3px, rgba(255,255,255,0.04) 5px, transparent 8px)
          `,
          backgroundSize: "15px 15px, 50px 50px",
        }}
      />

      <main className="min-h-[120vh] text-white">
        <Header />
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
