"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { checkAdminAuth } from "@/lib/api/admin";

export default function AdminRootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verify = async () => {
      const isAuthenticated = await checkAdminAuth();
      if (!isAuthenticated) {
        router.push("/login");
      } else {
        setIsLoading(false);
      }
    };
    verify();
  }, [router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-warm-beige">
        <div className="text-cinnamon font-bold animate-pulse text-lg">
          권한을 확인하고 있습니다...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
