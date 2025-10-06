"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import BounceLoader from "@/components/ui/bounce-loader";

export default function LandingRedirect() {
  const router = useRouter();

  useEffect(() => {
    const handleNavigation = async () => {
      try {
        await router.replace("/");
      } catch (error) {
        console.error("Navigation error:", error);
      }
    };

    handleNavigation();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <BounceLoader />
    </div>
  );
}
