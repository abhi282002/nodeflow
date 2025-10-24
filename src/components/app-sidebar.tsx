"use client"

import {CreditCardIcon, FolderOpenIcon, HistoryIcon, KeyIcon, LogOutIcon, StarIcon} from "lucide-react";
import Image from "next/image"
import Link from "next/link"
import {
    Sidebar,
    SidebarContent, SidebarFooter,
    SidebarGroup,
    SidebarGroupContent, SidebarHeader, SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from "@/components/ui/sidebar";
import {usePathname, useRouter} from "next/navigation";
import {authClient} from "@/lib/auth-client";
import {useHasActiveSubscription} from "../app/features/payment/hooks/use-payment";

const menuItems = [
    {
        title: "Workflows",
        items: [
            {
                title: "Workflows",
                icon: FolderOpenIcon,
                url: "/workflows"
            },
            {
                title: "Credentials",
                icon: KeyIcon,
                url: "/credentials"
            }, {
                title: "Executions",
                icon: HistoryIcon,
                url: "/execution"
            }
        ]
    }
]

export const AppSidebar = () => {
    const router = useRouter()
    const pathname = usePathname()


    const {hasActiveSubscription, isLoading} = useHasActiveSubscription()

    return <Sidebar collapsible={"icon"}>
        <SidebarHeader>
            <SidebarMenuItem>
                <SidebarMenuButton asChild className={"gap-x-4 h-10 px-4"}>
                    <Link href={"/workflows"} prefetch>
                        <Image src={"/logos/logo.svg"} alt={"Nodebase"} width={30} height={30}/>
                        <span className={"font-semibold text-sm"}>Nodebase</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                {
                    menuItems.map((group) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupContent>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton className={"gap-x-4 h-10 px-4"} tooltip={item.title}
                                                           isActive={
                                                               item.url === "/" ? pathname === "/" : pathname.startsWith(item.url)
                                                           } asChild>
                                            <Link href={item.url} prefetch>
                                                <item.icon className="size-4"/>
                                                <span>
                                                {item.title}
                                            </span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))}
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))
                }
            </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
            {!hasActiveSubscription && !isLoading && (
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton onClick={() => authClient.checkout({
                            slug: "nodebase pro"
                        })} className={"gap-x-4 h-10 px-4"} tooltip={"Upgrade to Pro"}>
                            <StarIcon className={"h-4 w-4"}/>
                            <span>Upgrade to Pro</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            )}
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => authClient.customer.portal()} className={"gap-x-4 h-10 px-4"}
                                       tooltip={"Billing Portal"}>
                        <CreditCardIcon className={"h-4 w-4"}/>
                        <span>Billing Portal</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton onClick={() => authClient.signOut({
                        fetchOptions: {
                            onSuccess: () => {
                                router.push("/login")
                            }
                        }
                    })} className={"gap-x-4 h-10 px-4"} tooltip={"Sign out"}>
                        <LogOutIcon className={"h-4 w-4"}/>
                        <span>Sign out</span>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
    </Sidebar>
}

