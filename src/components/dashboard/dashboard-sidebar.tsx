"use client"

import { BotIcon, Calendar, Home, Inbox, Search, Settings, StarIcon, VideoIcon } from "lucide-react"

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"
import DashboardUserButton from "./DashboardUserButton"
import Link from "next/link"
import Image from "next/image"
import { Separator } from "../ui/separator"
import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

// Menu items.
const firstSection = [
    {
        label: "Meetings",
        icon: VideoIcon,
        href: "/meetings"
    },
    {
        label: "Agents",
        icon: BotIcon,
        href: "/agents"
    },
]

const secondSection = [
    {
        label: "Upgrade",
        icon: StarIcon,
        href: "/upgarde"
    },
]

export function DashboardSidebar() {
    const pathname = usePathname();

    return (
        <Sidebar>
            <SidebarHeader className="text-shadow-sidebar-accent-foreground">
                <Link href={"/"} className="flex items-center gap-2 px-2 pt-2">
                    <Image src="/download-removebg-preview.png" alt="meet-ai" width={36} height={36} />
                    <p className="text-2xl font-semibold">Nova AI</p>
                </Link>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5D6B6A]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {firstSection.map((el, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B6B]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50", pathname === el.href && " bg-linear-to-r/oklchch border-[#5D6B6A]/10")}
                                        isActive={pathname === el.href}>
                                        <Link href={el.href} className="flex items-center gap-2">
                                            <el.icon className="size-5" />
                                            <span className="text-sm font-semibold tracking-tighter">{el.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>

                <Separator className="opacity-10 text-[#5D6B6A]" />

                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {secondSection.map((el, index) => (
                                <SidebarMenuItem key={index}>
                                    <SidebarMenuButton
                                        asChild
                                        className={cn("h-10 hover:bg-linear-to-r/oklch border border-transparent hover:border-[#5D6B6B]/10 from-sidebar-accent from-5% via-30% via-sidebar/50 to-sidebar/50", pathname === el.href && " bg-linear-to-r/oklchch border-[#5D6B6A]/10")}
                                        isActive={pathname === el.href}>
                                        <Link href={el.href} className="flex items-center gap-2">
                                            <el.icon className="size-5" />
                                            <span className="text-sm font-semibold tracking-tighter">{el.label}</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter className="text-white">
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}