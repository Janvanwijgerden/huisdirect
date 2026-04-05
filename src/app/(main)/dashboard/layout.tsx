import { ReactNode } from "react";
import { redirect } from "next/navigation";
import { createClient } from "../../../lib/supabase/server";

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

  return <>{children}</>;
}