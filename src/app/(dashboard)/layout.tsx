import { DashboardSidebar } from "@/components/dashboard/dashboard-sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import DashBoardNavBar from "@/components/dashboard/DashBoardNavBar";
interface Props {
    children: React.ReactNode
}
const Layout = ({ children }: Props) => {
    return (
        <SidebarProvider>
            <DashboardSidebar/>
            <main className="flex flex-col h-screen w-screen bg-muted">
            <DashBoardNavBar/>
            <div className="flex-1 overflow-y-auto">
                {children}
            </div>
            </main>
        </SidebarProvider>
    )
}

export default Layout;