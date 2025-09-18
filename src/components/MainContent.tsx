import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Badge } from "./ui/badge"
import { 
  BarChart3, 
  Package, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Users,
  Warehouse
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

export function MainContent() {
  const { t } = useLanguage()

  const stats = [
    {
      title: "Total Products",
      value: "2,847",
      change: "+12%",
      trend: "up",
      icon: Package
    },
    {
      title: "Active Warehouses", 
      value: "8",
      change: "+2",
      trend: "up",
      icon: Warehouse
    },
    {
      title: "Pending Orders",
      value: "156",
      change: "-8%", 
      trend: "down",
      icon: Clock
    },
    {
      title: "Active Users",
      value: "42",
      change: "+5%",
      trend: "up", 
      icon: Users
    }
  ]

  const recentActivities = [
    {
      type: "receipt",
      message: "Goods receipt #GR-2024-001 processed",
      time: "5 minutes ago",
      status: "completed"
    },
    {
      type: "issue", 
      message: "Goods issue #GI-2024-045 pending approval",
      time: "12 minutes ago",
      status: "pending"
    },
    {
      type: "transfer",
      message: "Transfer #TR-2024-023 completed",
      time: "25 minutes ago", 
      status: "completed"
    },
    {
      type: "inventory",
      message: "Inventory check scheduled for Warehouse A",
      time: "1 hour ago",
      status: "scheduled"
    },
    {
      type: "alert",
      message: "Low stock alert: Product SKU-12345",
      time: "2 hours ago",
      status: "alert"
    }
  ]

  const handleNavigation = (path: string) => {
    if (!path) return

    window.location.hash = path.startsWith('/') ? path.slice(1) : path
  }

  const quickActions = [
    {
      icon: Package,
      label: "Create Goods Receipt",
      onClick: () => handleNavigation("/warehouse/goods-receipt/create")
    },
    {
      icon: TrendingUp,
      label: "Process Goods Issue",
      onClick: () => handleNavigation("/warehouse/goods-issue")
    },
    {
      icon: BarChart3,
      label: "Start Inventory Count",
      onClick: () => handleNavigation("/warehouse/stock-onhand")
    },
    {
      icon: Warehouse,
      label: "View Stock Levels",
      onClick: () => handleNavigation("/warehouse/stock-onhand")
    }
  ]

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div>
        <h1 className="mb-2">Welcome to {t('common.warehouseManagement')}</h1>
        <p className="text-muted-foreground">
          Monitor your warehouse operations and track inventory in real-time.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center text-xs text-muted-foreground">
                <TrendingUp className={`mr-1 h-3 w-3 ${
                  stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
                }`} />
                <span className={stat.trend === 'up' ? 'text-green-500' : 'text-red-500'}>
                  {stat.change}
                </span>
                <span className="ml-1">from last month</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>



      {/* Recent Activities */}
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest warehouse operations and system activities
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div key={index} className="flex items-center space-x-4">
                  <div className="flex-shrink-0">
                    {activity.status === 'completed' && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                    {activity.status === 'pending' && (
                      <Clock className="h-4 w-4 text-yellow-500" />
                    )}
                    {activity.status === 'alert' && (
                      <AlertTriangle className="h-4 w-4 text-red-500" />
                    )}
                    {activity.status === 'scheduled' && (
                      <BarChart3 className="h-4 w-4 text-blue-500" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">
                      {activity.message}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <Badge variant={
                    activity.status === 'completed' ? 'default' :
                    activity.status === 'pending' ? 'secondary' :
                    activity.status === 'alert' ? 'destructive' : 'outline'
                  }>
                    {activity.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common warehouse management tasks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-2">
              {quickActions.map(action => (
                <button
                  key={action.label}
                  type="button"
                  onClick={action.onClick}
                  className="flex items-center justify-start space-x-2 rounded-md p-3 text-left transition-colors hover:bg-accent"
                >
                  <action.icon className="h-4 w-4" />
                  <span>{action.label}</span>
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}