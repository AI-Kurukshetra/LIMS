"use client";

import { Bell, Menu, Search } from "lucide-react";

import { AppSidebar } from "@/components/app-sidebar";
import { SignOutButton } from "@/components/sign-out-button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger
} from "@/components/ui/sheet";
import { roleLabels, type AppRole } from "@/lib/rbac";

function getInitial(name: string) {
  return name.trim().charAt(0).toUpperCase() || "U";
}

export function DashboardHeader({
  userName,
  userRole
}: {
  userName: string;
  userRole: AppRole;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-4 border-b border-border/70 bg-background/80 px-4 py-4 backdrop-blur-xl lg:px-8">
      <div className="lg:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-4 w-4" />
              <span className="sr-only">Open navigation</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="p-0">
            <SheetHeader className="sr-only">
              <SheetTitle>Navigation</SheetTitle>
            </SheetHeader>
            <AppSidebar className="border-r-0" role={userRole} />
          </SheetContent>
        </Sheet>
      </div>
      <div className="relative hidden max-w-md flex-1 lg:block">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#6e9092]" />
        <Input className="pl-10" placeholder="Search samples, reports, clients, or doctor assignments" />
      </div>
      <div className="ml-auto flex items-center gap-3">
        <Button variant="outline" size="icon">
          <Bell className="h-4 w-4" />
          <span className="sr-only">Notifications</span>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 rounded-full border border-border/80 bg-white/70 px-2 py-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
              <Avatar className="h-10 w-10 border border-border">
                <AvatarFallback>{getInitial(userName)}</AvatarFallback>
              </Avatar>
              <div className="hidden text-left sm:block">
                <p className="text-sm font-semibold text-[#12343b]">{userName}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-[#6c8d90]">
                  {roleLabels[userRole]}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuLabel className="-mt-2 text-xs font-medium uppercase tracking-[0.18em] text-[#6c8d90]">
              {roleLabels[userRole]}
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>My role access</DropdownMenuItem>
            <SignOutButton />
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
