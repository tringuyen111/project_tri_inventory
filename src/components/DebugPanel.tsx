import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Button } from "./ui/button"
import { Badge } from "./ui/badge"
import { useTheme } from "../contexts/ThemeContext"
import { useLanguage } from "../contexts/LanguageContext"
import { Sun, Moon, Languages } from "lucide-react"

export function DebugPanel() {
  const { theme, toggleTheme } = useTheme()
  const { language, setLanguage, t } = useLanguage()

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>Theme & Language Debug Panel</CardTitle>
        <CardDescription>
          Test theme switching and language switching functionality
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current State */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span>Current Theme:</span>
            <Badge variant={theme === 'light' ? 'default' : 'secondary'}>
              {theme === 'light' ? 'Light' : 'Dark'}
            </Badge>
          </div>
          <div className="flex items-center justify-between">
            <span>Current Language:</span>
            <Badge variant={language === 'en' ? 'default' : 'secondary'}>
              {language === 'en' ? 'English' : 'Vietnamese'}
            </Badge>
          </div>
        </div>

        {/* Theme Controls */}
        <div className="space-y-2">
          <h4>Theme Controls:</h4>
          <div className="flex gap-2">
            <Button 
              variant={theme === 'light' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTheme()}
              className="flex items-center gap-2"
            >
              <Sun className="h-4 w-4" />
              Light
            </Button>
            <Button 
              variant={theme === 'dark' ? 'default' : 'outline'}
              size="sm"
              onClick={() => toggleTheme()}
              className="flex items-center gap-2"
            >
              <Moon className="h-4 w-4" />
              Dark
            </Button>
          </div>
        </div>

        {/* Language Controls */}
        <div className="space-y-2">
          <h4>Language Controls:</h4>
          <div className="flex gap-2">
            <Button 
              variant={language === 'en' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('en')}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              English
            </Button>
            <Button 
              variant={language === 'vi' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setLanguage('vi')}
              className="flex items-center gap-2"
            >
              <Languages className="h-4 w-4" />
              Tiếng Việt
            </Button>
          </div>
        </div>

        {/* Translation Test */}
        <div className="space-y-2">
          <h4>Translation Test:</h4>
          <div className="text-sm space-y-1">
            <p><strong>{t('common.warehouseManagement')}</strong></p>
            <p>{t('nav.dashboards')}</p>
            <p>{t('nav.stockOnhand')}</p>
            <p>{t('common.profile')}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}