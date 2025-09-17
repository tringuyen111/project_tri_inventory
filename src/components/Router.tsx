import { useState, useEffect } from 'react'
import { MainContent } from './MainContent'
import { OrganizationManagement } from './organization/OrganizationManagement'
import { BranchManagement } from './branch/BranchManagement'
import { WarehouseManagement } from './warehouse/WarehouseManagement'
import { LocationManagement } from './location/LocationManagement'
import { UoMManagement } from './uom/UoMManagement'
import { PartnerManagement } from './partner/PartnerManagement'
import { AssetTypeManagement } from './assettype/AssetTypeManagement'
import { ModelAssetManagement } from './modelasset/ModelAssetManagement'
import { StockOnhandManagement } from './stockonhand/StockOnhandManagement'
import { GoodsReceiptManagement } from './goodsreceipt/GoodsReceiptManagement'
import { GoodsReceiptFormWrapper } from './goodsreceipt/GoodsReceiptFormWrapper'
import { GoodsReceiptDetail } from './goodsreceipt/GoodsReceiptDetail'
import { GoodsReceiptApproval } from './goodsreceipt/GoodsReceiptApproval'
import { GoodsReceiptSubmit } from './goodsreceipt/GoodsReceiptSubmit'

type RouteKey = 
  | 'dashboard' 
  | 'organization'
  | 'branch'
  | 'warehouse'
  | 'location'
  | 'uom'
  | 'partner'
  | 'assettype'
  | 'modelasset'
  | 'stockonhand'
  | 'goodsreceipt'
  | 'goodsreceipt/create'
  | 'goodsreceipt/edit'
  | 'goodsreceipt/view'
  | 'goodsreceipt/approve'
  | 'goodsreceipt/submit'

interface RouterProps {
  currentRoute: RouteKey
}

export function Router({ currentRoute }: RouterProps) {
  switch (currentRoute) {
    case 'organization':
      return <OrganizationManagement />
    case 'branch':
      return <BranchManagement />
    case 'warehouse':
      return <WarehouseManagement />
    case 'location':
      return <LocationManagement />
    case 'uom':
      return <UoMManagement />
    case 'partner':
      return <PartnerManagement />
    case 'assettype':
      return <AssetTypeManagement />
    case 'modelasset':
      return <ModelAssetManagement />
    case 'stockonhand':
      return <StockOnhandManagement />
    case 'goodsreceipt':
      return <GoodsReceiptManagement />
    case 'goodsreceipt/create':
      return <GoodsReceiptFormWrapper mode="create" />
    case 'goodsreceipt/edit':
      const receiptId = localStorage.getItem('editingReceiptId')
      return <GoodsReceiptFormWrapper mode="edit" receiptId={receiptId || undefined} />
    case 'goodsreceipt/view':
      const viewReceiptId = localStorage.getItem('viewingReceiptId')
      return <GoodsReceiptDetail receiptId={viewReceiptId || undefined} />
    case 'goodsreceipt/approve':
      const approvalReceiptId = localStorage.getItem('approvingReceiptId')
      return <GoodsReceiptApproval 
        receiptId={approvalReceiptId || ''} 
        onBack={() => window.location.hash = '#warehouse/goods-receipt'} 
      />
    case 'goodsreceipt/submit':
      const submitReceiptId = localStorage.getItem('submittingReceiptId')
      return <GoodsReceiptSubmit 
        receiptId={submitReceiptId || ''} 
        onBack={() => window.location.hash = '#warehouse/goods-receipt'} 
      />
    case 'dashboard':
    default:
      return <MainContent />
  }
}

// Simple context for routing
export const useRouter = () => {
  const [currentRoute, setCurrentRoute] = useState<RouteKey>('dashboard')

  // Listen to hash changes
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.slice(1)
      const routeMap: Record<string, RouteKey> = {
        'master/organization': 'organization',
        'master/branch': 'branch', 
        'master/warehouse': 'warehouse',
        'master/location': 'location',
        'master/uom': 'uom',
        'master/partner': 'partner',
        'assets/assettype': 'assettype',
        'assets/modelasset': 'modelasset',
        'warehouse/stock-onhand': 'stockonhand',
        'warehouse/goods-receipt': 'goodsreceipt',
        'warehouse/goods-receipt/create': 'goodsreceipt/create',
        'warehouse/goods-receipt/edit': 'goodsreceipt/edit',
        'warehouse/goods-receipt/view': 'goodsreceipt/view',
        'warehouse/goods-receipt/approve': 'goodsreceipt/approve',
        'warehouse/goods-receipt/submit': 'goodsreceipt/submit',
        'dashboards': 'dashboard'
      }
      
      setCurrentRoute(routeMap[hash] || 'dashboard')
    }

    // Set initial route
    handleHashChange()
    
    // Listen for hash changes
    window.addEventListener('hashchange', handleHashChange)
    
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigate = (route: RouteKey) => {
    const routeMap: Record<RouteKey, string> = {
      'dashboard': '#dashboards',
      'organization': '#master/organization',
      'branch': '#master/branch',
      'warehouse': '#master/warehouse',
      'location': '#master/location',
      'uom': '#master/uom',
      'partner': '#master/partner',
      'assettype': '#assets/assettype',
      'modelasset': '#assets/modelasset',
      'stockonhand': '#warehouse/stock-onhand',
      'goodsreceipt': '#warehouse/goods-receipt',
      'goodsreceipt/create': '#warehouse/goods-receipt/create',
      'goodsreceipt/edit': '#warehouse/goods-receipt/edit',
      'goodsreceipt/view': '#warehouse/goods-receipt/view',
      'goodsreceipt/approve': '#warehouse/goods-receipt/approve',
      'goodsreceipt/submit': '#warehouse/goods-receipt/submit'
    }
    
    window.location.hash = routeMap[route]
  }

  return { currentRoute, navigate }
}