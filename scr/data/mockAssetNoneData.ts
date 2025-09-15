import { AssetNone } from '../types/assetNone'

export const mockAssetNones: AssetNone[] = [
  {
    id: '1',
    model_code: 'MD_003',
    model_name: 'Office Chair Ergonomic',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    wh_code: 'WH001',
    wh_name: 'Main Warehouse',
    location_code: 'A-01-01',
    location_name: 'A-01-01 (Storage Area)',
    qty_onhand: 25,
    status: 'Active',
    created_date: '2024-01-15T10:30:00Z',
    updated_date: '2024-01-20T14:45:00Z'
  },
  {
    id: '2',
    model_code: 'MD_003',
    model_name: 'Office Chair Ergonomic',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    wh_code: 'WH002',
    wh_name: 'Secondary Warehouse',
    location_code: 'B-02-01',
    location_name: 'B-02-01 (Storage Area)',
    qty_onhand: 12,
    status: 'Active',
    created_date: '2024-01-16T09:15:00Z',
    updated_date: '2024-01-22T11:30:00Z'
  },
  {
    id: '3',
    model_code: 'MD_010',
    model_name: 'Stationery Pack Basic',
    uom_code: 'BOX',
    uom_name: 'Box',
    wh_code: 'WH001',
    wh_name: 'Main Warehouse',
    location_code: 'A-02-03',
    location_name: 'A-02-03 (Office Supplies)',
    qty_onhand: 150,
    status: 'Active',
    created_date: '2024-01-17T14:20:00Z',
    updated_date: '2024-01-25T16:10:00Z'
  },
  {
    id: '4',
    model_code: 'MD_011',
    model_name: 'Cleaning Supplies Kit',
    uom_code: 'CASE',
    uom_name: 'Case',
    wh_code: 'WH003',
    wh_name: 'Distribution Center',
    location_code: 'C-01-05',
    location_name: 'C-01-05 (Maintenance)',
    qty_onhand: 0,
    status: 'Active',
    created_date: '2024-01-18T11:45:00Z',
    updated_date: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    model_code: 'MD_012',
    model_name: 'Safety Equipment Set',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    wh_code: 'WH001',
    wh_name: 'Main Warehouse',
    location_code: 'A-03-01',
    location_name: 'A-03-01 (Safety)',
    qty_onhand: 8,
    status: 'Inactive',
    created_date: '2024-01-19T16:30:00Z',
    updated_date: '2024-02-01T09:20:00Z'
  }
]



// Mock function to simulate checking if asset none record has inventory movement
export const hasAssetNoneInventoryMovement = (assetNoneId: string): boolean => {
  // Records with qty_onhand > 0 cannot be deleted
  const record = mockAssetNones.find(asset => asset.id === assetNoneId)
  return record ? record.qty_onhand > 0 : false
}

// Mock function to get asset none records by warehouse
export const getAssetNonesByWarehouse = (whCode: string): AssetNone[] => {
  return mockAssetNones.filter(asset => asset.wh_code === whCode)
}

// Mock function to get asset none records by location  
export const getAssetNonesByLocation = (whCode: string, locationCode: string): AssetNone[] => {
  return mockAssetNones.filter(asset => 
    asset.wh_code === whCode && asset.location_code === locationCode
  )
}

// Mock function to check if a combination of model, warehouse, location already exists
export const assetNoneExistsAtLocation = (modelCode: string, whCode: string, locationCode: string): boolean => {
  return mockAssetNones.some(asset => 
    asset.model_code === modelCode && 
    asset.wh_code === whCode && 
    asset.location_code === locationCode
  )
}