import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";
import { getUserListings } from "../../../lib/actions/listings";
import AppSidebar from "../../../components/dashboard/AppSidebar";

type Props = {
  children: ReactNode;
};

export default async function DashboardLayout({ children }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/login");
  }

  const userListings = await getUserListings(user.id);
  const listingCount = userListings.length;

  return (
    <div className="min-h-[calc(100vh-6rem)] bg-slate-50 xl:flex">
      <AppSidebar listingCount={listingCount} />

      <div className="min-w-0 flex-1">
        <div className="mx-auto w-full max-w-[1600px]">
          {children}
        </div>
      </div>
    </div>
  );
}