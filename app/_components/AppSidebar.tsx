'use client'
import React from 'react'
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
} from "@/components/ui/sidebar"
import { Calendar, Inbox, Layers, UserCircle, Wallet } from "lucide-react"
import Image from 'next/image'
import { usePathname } from 'next/navigation'

const items = [
    { title: "Workspace", url: "/dashboard", icon: Layers },
    { title: "AI Tools", url: "/all-ai-tools", icon: Inbox },
    { title: "My History", url: "/my-history", icon: Calendar },
    { title: "Billing", url: "/billing", icon: Wallet },
    { title: "Profile", url: "/profile", icon: UserCircle },
]

export function AppSidebar() {
    const path = usePathname();

    return (
        <Sidebar className="bg-white/60 backdrop-blur-md shadow-xl border-r border-gray-200">
            {/* Logo & Header */}
            <SidebarHeader className="p-6 border-b border-gray-200">
                <div className="flex flex-col items-center gap-2">
                    <Image src="/logo.png" alt="logo" width={120} height={120} />
                    <h2 className="text-xs text-gray-500 font-medium tracking-wide">
                        Build Awesome Skills
                    </h2>
                </div>
            </SidebarHeader>

            {/* Menu */}
            <SidebarContent className="py-4">
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu className="space-y-1">
                            {items.map((item, index) => {
                                const isActive = path.includes(item.url);
                                return (
                                    <a
                                        key={index}
                                        href={item.url}
                                        className={`flex items-center gap-3 px-4 py-2 text-sm font-medium rounded-lg transition-colors
                                            ${
                                                isActive
                                                    ? "bg-gradient-to-r from-indigo-500/20 to-indigo-500/10 text-indigo-600 shadow-inner"
                                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                            }
                                        `}
                                    >
                                        <item.icon className="w-5 h-5" />
                                        <span>{item.title}</span>
                                    </a>
                                );
                            })}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            {/* Footer */}
            <SidebarFooter className="mt-auto p-4 border-t border-gray-200 text-center">
                <p className="text-xs text-gray-400">&copy; 2025 TGAYS</p>
            </SidebarFooter>
        </Sidebar>
    );
}
