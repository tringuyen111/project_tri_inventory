import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "./ui/sidebar"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "./ui/collapsible"
import {
  BarChart3,
  Package,
  Boxes,
  ClipboardList,
  ArrowDownToLine,
  ArrowUpFromLine,
  ArrowRightLeft,
  ArrowDownUp,
  HardDrive,
  Tags,
  Database,
  List,
  Building2,
  GitBranch,
  Warehouse,
  MapPin,
  Scale,
  Users,
  FileText,
  TrendingUp,
  Building,
  Package2,
  Settings,
  Shield,
  Cog,
  ChevronRight
} from "lucide-react"
import { useLanguage } from "../contexts/LanguageContext"

export function AppSidebar() {
  const { t } = useLanguage()

  const handleNavigation = (url: string) => {
    window.location.hash = url.startsWith('/') ? url.slice(1) : url
  }

  const menuItems = [
    {
      title: t('nav.dashboards'),
      icon: BarChart3,
      url: "/dashboards"
    },
    {
      title: t('nav.warehouseOperations'),
      icon: Package,
      items: [
        {
          title: t('nav.stockOnhand'),
          icon: Boxes,
          url: "/warehouse/stock-onhand"
        },
        {
          title: t('nav.inventory'),
          icon: ClipboardList,
          url: "/warehouse/inventory"
        },
        {
          title: t('nav.goodsReceipt'),
          icon: ArrowDownToLine,
          url: "/warehouse/goods-receipt"
        },
        {
          title: t('nav.goodsIssue'),
          icon: ArrowUpFromLine,
          url: "/warehouse/goods-issue"
        },
        {
          title: t('nav.goodsTransfer'),
          icon: ArrowRightLeft,
          url: "/warehouse/goods-transfer"
        },
        {
          title: t('nav.putaway'),
          icon: ArrowDownUp,
          url: "/warehouse/putaway"
        }
      ]
    },
    {
      title: t('nav.assetManagement'),
      icon: HardDrive,
      items: [
        {
          title: t('nav.assetType'),
          icon: Tags,
          url: "/assets/assettype"
        },
        {
          title: t('nav.modelAsset'),
          icon: Database,
          url: "/assets/modelasset"
        }
      ]
    },
    {
      title: t('nav.masterData'),
      icon: Database,
      items: [
        {
          title: t('nav.organization'),
          icon: Building2,
          url: "/master/organization"
        },
        {
          title: t('nav.branch'),
          icon: GitBranch,
          url: "/master/branch"
        },
        {
          title: t('nav.warehouse'),
          icon: Warehouse,
          url: "/master/warehouse"
        },
        {
          title: t('nav.location'),
          icon: MapPin,
          url: "/master/location"
        },
        {
          title: t('nav.uom'),
          icon: Scale,
          url: "/master/uom"
        },
        {
          title: t('nav.partner'),
          icon: Users,
          url: "/master/partner"
        }
      ]
    },
    {
      title: t('nav.reports'),
      icon: FileText,
      items: [
        {
          title: t('nav.inventoryReport'),
          icon: TrendingUp,
          url: "/reports/inventory"
        },
        {
          title: t('nav.stockByWarehouse'),
          icon: Building,
          url: "/reports/stock-by-warehouse"
        },
        {
          title: t('nav.assetReport'),
          icon: Package2,
          url: "/reports/asset"
        }
      ]
    },
    {
      title: t('nav.admin'),
      icon: Settings,
      items: [
        {
          title: t('nav.authentication'),
          icon: Shield,
          url: "/admin/authentication"
        },
        {
          title: t('nav.systemConfig'),
          icon: Cog,
          url: "/admin/system-config"
        }
      ]
    }
  ]

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {menuItems.map((item) => (
              <SidebarMenuItem key={item.title}>
                {item.items ? (
                  <Collapsible className="group/collapsible">
                    <CollapsibleTrigger asChild>
                      <SidebarMenuButton tooltip={item.title}>
                        <item.icon />
                        <span>{item.title}</span>
                        <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      </SidebarMenuButton>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <SidebarMenuSub>
                        {item.items.map((subItem) => (
                          <SidebarMenuSubItem key={subItem.title}>
                            <SidebarMenuSubButton asChild>
                              <button onClick={() => handleNavigation(subItem.url)}>
                                <subItem.icon />
                                <span>{subItem.title}</span>
                              </button>
                            </SidebarMenuSubButton>
                          </SidebarMenuSubItem>
                        ))}
                      </SidebarMenuSub>
                    </CollapsibleContent>
                  </Collapsible>
                ) : (
                  <SidebarMenuButton asChild tooltip={item.title}>
                    <button onClick={() => handleNavigation(item.url)}>
                      <item.icon />
                      <span>{item.title}</span>
                    </button>
                  </SidebarMenuButton>
                )}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}