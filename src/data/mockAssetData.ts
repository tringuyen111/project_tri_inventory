import { Asset, AssetHistory } from '../types/asset'

export const mockAssets: Asset[] = [
  {
    id: '1',
    asset_id: 'AST-2024-000001',
    model_code: 'MD_001',
    model_name: 'Dell OptiPlex 7090',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    serial_number: 'DL001-SN-001',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    location_code: 'LO_001',
    location_name: 'General Storage Area A',
    status: 'InStock',
    created_date: '2024-01-15T08:00:00Z',
    updated_date: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    asset_id: 'AST-2024-000002',
    model_code: 'MD_001',
    model_name: 'Dell OptiPlex 7090',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    serial_number: 'DL001-SN-002',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    location_code: 'LO_002',
    location_name: 'Raw Materials Section',
    status: 'Issued',
    created_date: '2024-01-15T09:00:00Z',
    updated_date: '2024-01-20T14:30:00Z'
  },
  {
    id: '3',
    asset_id: 'AST-2024-000003',
    model_code: 'MD_002',
    model_name: 'HP LaserJet Pro 404dn',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    serial_number: 'HP-LJ-001',
    wh_code: 'WH_002',
    wh_name: 'Raw Materials Warehouse',
    location_code: 'LO_004',
    location_name: 'Electronics Storage',
    status: 'InStock',
    created_date: '2024-01-16T10:00:00Z',
    updated_date: '2024-01-16T10:00:00Z'
  },
  {
    id: '4',
    asset_id: 'AST-2024-000004',
    model_code: 'MD_006',
    model_name: 'Microsoft Surface Laptop 5',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    serial_number: 'MSL5-001',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    location_code: '',
    location_name: '',
    partner_code: 'PT_001',
    partner_name: 'Công ty ABC',
    status: 'Issued',
    created_date: '2024-01-17T11:00:00Z',
    updated_date: '2024-01-25T16:00:00Z'
  },
  {
    id: '5',
    asset_id: 'AST-2024-000005',
    model_code: 'MD_001',
    model_name: 'Dell OptiPlex 7090',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    serial_number: 'DL001-SN-003',
    wh_code: 'WH_001',
    wh_name: 'Main Warehouse',
    location_code: 'LO_003',
    location_name: 'Finished Goods Area',
    status: 'Disposed',
    created_date: '2024-01-18T12:00:00Z',
    updated_date: '2024-01-30T09:00:00Z'
  }
]

export const mockAssetHistory: AssetHistory[] = [
  {
    id: '1',
    asset_id: 'AST-2024-000001',
    action: 'Created',
    new_value: 'InStock',
    timestamp: '2024-01-15T08:00:00Z'
  },
  {
    id: '2',
    asset_id: 'AST-2024-000002',
    action: 'Created',
    new_value: 'InStock',
    timestamp: '2024-01-15T09:00:00Z'
  },
  {
    id: '3',
    asset_id: 'AST-2024-000002',
    action: 'StatusChanged',
    old_value: 'InStock',
    new_value: 'Issued',
    timestamp: '2024-01-20T14:30:00Z'
  },
  {
    id: '4',
    asset_id: 'AST-2024-000004',
    action: 'PartnerAssigned',
    old_value: '',
    new_value: 'PT_001',
    timestamp: '2024-01-25T16:00:00Z'
  },
  {
    id: '5',
    asset_id: 'AST-2024-000005',
    action: 'StatusChanged',
    old_value: 'InStock',
    new_value: 'Disposed',
    timestamp: '2024-01-30T09:00:00Z'
  }
]

// Helper functions
export function getSerialAssets(): Asset[] {
  return mockAssets
}

export function getAssetHistory(assetId: string): AssetHistory[] {
  return mockAssetHistory.filter(h => h.asset_id === assetId)
}

export function isSerialNumberUnique(serialNumber: string, excludeAssetId?: string): boolean {
  return !mockAssets.some(asset => 
    asset.serial_number === serialNumber && asset.id !== excludeAssetId
  )
}

export function generateAssetId(): string {
  const year = new Date().getFullYear()
  const count = mockAssets.length + 1
  return `AST-${year}-${count.toString().padStart(6, '0')}`
}

export function getNextAssetId(): string {
  return generateAssetId()
}