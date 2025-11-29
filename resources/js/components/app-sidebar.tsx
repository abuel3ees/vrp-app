import * as React from "react"
import {
  IconDashboard,
  IconUsers,
  IconTruck,
  IconMap2,
  IconRoute,
  IconDatabase,
  IconReport,
  IconFileWord,
  IconSettings,
  IconHelp,
  IconChevronDown,
} from "@tabler/icons-react"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Link, usePage } from "@inertiajs/react"

export function AppSidebar(props: React.ComponentProps<typeof Sidebar>) {
  const current = usePage().url

  const navMain = [
    { title: "Dashboard", url: "/admin/dashboard", icon: IconDashboard },
    { title: "Drivers", url: "/admin/drivers", icon: IconUsers },
    { title: "Vehicles", url: "/admin/vehicles", icon: IconTruck },
    { title: "Deliveries", url: "/admin/deliveries", icon: IconMap2 },
    { title: "Routes", url: "/admin/routes", icon: IconRoute },
    { title: "Users", url: "/admin/users", icon: IconUsers },
    { title: "Instances", url: "/admin/instances", icon: IconDatabase },
  ]

  const navSecondary = [
    { title: "Settings", url: "/settings", icon: IconSettings },
    { title: "Help", url: "/help", icon: IconHelp },
  ]

  // For collapsible Data Library
  const [openLibrary, setOpenLibrary] = React.useState(false)

  const user = {
    name: "Admin",
    email: "admin@example.com",
    avatar:
      "https://ui-avatars.com/api/?name=Admin&background=0D8ABC&color=fff",
  }

  return (
    <Sidebar collapsible="offcanvas" {...props}>
      
      {/* HEADER */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
        <SidebarMenuButton asChild>
          <Link href="/">
            <IconDashboard />
            <span className="text-base font-semibold">VRP Solver</span>
          </Link>
        </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* CONTENT */}
      <SidebarContent>

        {/* MAIN NAV */}
        <NavMain items={navMain} />

        {/* COLLAPSIBLE DATA LIBRARY */}
        <SidebarMenu className="mt-6">
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={() => setOpenLibrary(!openLibrary)}
              className="flex justify-between w-full cursor-pointer"
            >
              <div className="flex items-center gap-2">
                <IconDatabase className="mr-2" />
                <span>Data Library</span>
              </div>
              <IconChevronDown
                size={18}
                className={`transition-transform ${
                  openLibrary ? "rotate-180" : ""
                }`}
              />
            </SidebarMenuButton>

            {/* Submenu */}
            {openLibrary && (
              <div className="ml-8 mt-2 flex flex-col space-y-1">
                <Link href="/admin/data-library" className="text-sm hover:text-orange-400">
                  Overview / Index
                </Link>

                <Link href="/admin/data-library/avenues" className="text-sm hover:text-orange-400">
                  Avenues
                </Link>

                <Link href="/admin/data-library/highways" className="text-sm hover:text-orange-400">
                  Highways
                </Link>

                <Link href="/admin/data-library/streets" className="text-sm hover:text-orange-400">
                  Streets
                </Link>

                <Link href="/admin/data-library/paths" className="text-sm hover:text-orange-400">
                  Paths
                </Link>

                <Link href="/admin/data-library/penalties" className="text-sm hover:text-orange-400">
                  Penalties
                </Link>

                <Link href="/admin/data-library/metadata" className="text-sm hover:text-orange-400">
                  Metadata
                </Link>
              </div>
            )}
          </SidebarMenuItem>
        </SidebarMenu>

        {/* DOCUMENTS SECTION */}
        <SidebarMenu className="mt-6">
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/reports">
                <IconReport />
                <span>Reports</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>

          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Link href="/assistant">
                <IconFileWord />
                <span>Word Assistant</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>

        {/* SECONDARY NAV */}
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>

      {/* FOOTER */}
      <SidebarFooter>
        <NavUser user={user} />
      </SidebarFooter>

    </Sidebar>
  )
}