import { useEffect } from "react";
import { useRouter } from "next/router";

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/dashboard/persimpangan");
  }, [router]);

  return null;
}
