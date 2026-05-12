import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import { Separator } from "@/components/ui/separator";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Fetch user profile from our database
  let dbUser = null;
  if (user) {
    dbUser = await prisma.user.findUnique({
      where: { id: user.id },
    });
  }

  return (
    <SidebarProvider>
      <AppSidebar
        userEmail={user?.email}
        userName={dbUser?.name}
      />
      <SidebarInset>
        <header className="flex h-14 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-6" />
          <div className="flex-1" />
          <ModeToggle />
        </header>
        <main className="flex-1 overflow-auto p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  );
}
