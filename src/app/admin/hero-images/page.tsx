import { redirect } from "next/navigation";
import HeroImagesDashboard from "@/components/admin/HeroImagesDashboard";
import { isAdminAuthenticated } from "@/lib/admin-auth";

export default async function HeroImagesPage() {
  const authenticated = await isAdminAuthenticated();

  if (!authenticated) {
    redirect("/admin/login");
  }

  return <HeroImagesDashboard />;
}
