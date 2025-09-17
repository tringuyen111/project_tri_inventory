import { SidebarProvider } from "./components/ui/sidebar"
import { TooltipProvider } from "./components/ui/tooltip"
import { AppSidebar } from "./components/AppSidebar"
import { TopBar } from "./components/TopBar"
import { Router, useRouter } from "./components/Router"
import { Toaster } from "./components/Toaster"
import { ThemeProvider } from "./contexts/ThemeContext"
import { LanguageProvider } from "./contexts/LanguageContext"

function AppContent() {
  const { currentRoute } = useRouter()

  return (
    <div className="flex min-h-screen w-full">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <TopBar />
        <main className="flex-1 p-6">
          <Router currentRoute={currentRoute} />
        </main>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <TooltipProvider>
          <SidebarProvider>
            <AppContent />
            <Toaster />
          </SidebarProvider>
        </TooltipProvider>
      </LanguageProvider>
    </ThemeProvider>
  )  
}
