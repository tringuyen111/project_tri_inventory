import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "./ui/dropdown-menu"
import { SidebarTrigger } from "./ui/sidebar"
import { 
  User, 
  Settings, 
  LogOut, 
  Sun, 
  Moon, 
  Languages,
  Warehouse
} from "lucide-react"
import { useTheme } from "../contexts/ThemeContext"
import { useLanguage } from "../contexts/LanguageContext"

export function TopBar() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger className="-ml-1" />
      
      {/* Logo and Title */}
      <div className="flex items-center gap-2 mr-auto">
        <div className="flex items-center justify-center w-8 h-8 bg-primary rounded-lg">
          <Warehouse className="h-4 w-4 text-primary-foreground" />
        </div>
        <span className="hidden sm:inline font-medium">
          {t('common.warehouseManagement')}
        </span>
      </div>



      {/* User Profile Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">WM</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <div className="flex items-center space-x-2 p-2">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-primary text-primary-foreground">WM</AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-1">
              <p className="leading-none">Warehouse Manager</p>
              <p className="text-xs text-muted-foreground">manager@warehouse.com</p>
            </div>
          </div>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>{t('common.profile')}</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>{t('common.settings')}</span>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          {/* Theme Toggle */}
          <DropdownMenuItem onClick={toggleTheme}>
            {theme === 'light' ? (
              <>
                <Moon className="mr-2 h-4 w-4" />
                <span>{t('common.darkMode')}</span>
              </>
            ) : (
              <>
                <Sun className="mr-2 h-4 w-4" />
                <span>{t('common.lightMode')}</span>
              </>
            )}
          </DropdownMenuItem>
          
          {/* Language Selection */}
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <Languages className="mr-2 h-4 w-4" />
              <span>{t('common.language')}</span>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem 
                onClick={() => setLanguage('en')}
                className={language === 'en' ? 'bg-accent' : ''}
              >
                {t('common.english')}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => setLanguage('vn')}
                className={language === 'vn' ? 'bg-accent' : ''}
              >
                {t('common.vietnamese')}
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>{t('common.logout')}</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}