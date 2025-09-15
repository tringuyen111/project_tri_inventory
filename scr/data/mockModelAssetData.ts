import { ModelAsset } from '../types/modelAsset'

export const mockModelAssets: ModelAsset[] = [
  {
    id: '1',
    model_code: 'MD_001',
    model_name: 'Dell OptiPlex 7090',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Serial',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: 'Business desktop computer with Intel Core i7',
    status: 'Active',
    created_date: '2024-01-15T10:30:00Z',
    updated_date: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    model_code: 'MD_002',
    model_name: 'HP LaserJet Pro 404dn',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Serial',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: 'Monochrome laser printer with duplex printing',
    status: 'Active',
    created_date: '2024-01-16T09:15:00Z',
    updated_date: '2024-01-16T09:15:00Z'
  },
  {
    id: '3',
    model_code: 'MD_003',
    model_name: 'Office Chair Ergonomic',
    asset_type_code: 'FURNITURE',
    asset_type_name: 'Furniture',
    tracking_type: 'None',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: 'Adjustable ergonomic office chair',
    status: 'Active',
    created_date: '2024-01-17T14:20:00Z',
    updated_date: '2024-01-17T14:20:00Z'
  },
  {
    id: '4',
    model_code: 'MD_004',
    model_name: 'Network Cable Cat6',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Lot',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    description: '1000ft Cat6 Ethernet cable roll',
    status: 'Active',
    created_date: '2024-01-18T11:45:00Z',
    updated_date: '2024-01-18T11:45:00Z'
  },
  {
    id: '5',
    model_code: 'MD_005',
    model_name: 'iPhone 15 Pro',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Serial',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: 'Apple iPhone 15 Pro 256GB Space Black',
    status: 'Inactive',
    created_date: '2024-01-19T16:30:00Z',
    updated_date: '2024-02-15T10:20:00Z'
  },
  {
    id: '6',
    model_code: 'MD_006',
    model_name: 'Microsoft Surface Laptop 5',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Serial',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: '13.5" touchscreen laptop with Intel Core i5',
    status: 'Active',
    created_date: '2024-01-20T13:10:00Z',
    updated_date: '2024-01-20T13:10:00Z'
  },
  {
    id: '7',
    model_code: 'MD_007',
    model_name: 'Pharmaceutical Compound A',
    asset_type_code: 'CHEMICALS',
    asset_type_name: 'Chemicals',
    tracking_type: 'Lot',
    uom_code: 'G',
    uom_name: 'Gram',
    description: 'Active pharmaceutical ingredient with expiration tracking',
    status: 'Active',
    created_date: '2024-01-21T08:00:00Z',
    updated_date: '2024-01-21T08:00:00Z'
  },
  {
    id: '8',
    model_code: 'MD_008',
    model_name: 'Cotton Fabric Roll',
    asset_type_code: 'TEXTILES',
    asset_type_name: 'Textiles',
    tracking_type: 'Lot',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    description: '100% cotton fabric roll, requires batch tracking',
    status: 'Active',
    created_date: '2024-01-22T09:30:00Z',
    updated_date: '2024-01-22T09:30:00Z'
  },
  {
    id: '9',
    model_code: 'MD_009',
    model_name: 'Electronic Component Package',
    asset_type_code: 'ELECTRONICS',
    asset_type_name: 'Electronics',
    tracking_type: 'Lot',
    uom_code: 'BOX',
    uom_name: 'Box',
    description: 'Bulk electronic components requiring batch control',
    status: 'Active',
    created_date: '2024-01-23T11:15:00Z',
    updated_date: '2024-01-23T11:15:00Z'
  },
  {
    id: '10',
    model_code: 'MD_010',
    model_name: 'Stationery Pack Basic',
    asset_type_code: 'OFFICE_SUPPLIES',
    asset_type_name: 'Office Supplies',
    tracking_type: 'None',
    uom_code: 'BOX',
    uom_name: 'Box',
    description: 'Basic stationery pack with pens, paper, and folders',
    status: 'Active',
    created_date: '2024-01-24T10:00:00Z',
    updated_date: '2024-01-24T10:00:00Z'
  },
  {
    id: '11',
    model_code: 'MD_011',
    model_name: 'Cleaning Supplies Kit',
    asset_type_code: 'MAINTENANCE',
    asset_type_name: 'Maintenance',
    tracking_type: 'None',
    uom_code: 'CASE',
    uom_name: 'Case',
    description: 'Complete cleaning supplies kit for office maintenance',
    status: 'Active',
    created_date: '2024-01-25T11:30:00Z',
    updated_date: '2024-01-25T11:30:00Z'
  },
  {
    id: '12',
    model_code: 'MD_012',
    model_name: 'Safety Equipment Set',
    asset_type_code: 'SAFETY',
    asset_type_name: 'Safety',
    tracking_type: 'None',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    description: 'Basic safety equipment set including helmets and vests',
    status: 'Active',
    created_date: '2024-01-26T14:15:00Z',
    updated_date: '2024-01-26T14:15:00Z'
  }
]

// Mock function to simulate checking if model asset has references
export const hasModelAssetReferences = (modelAssetId: string): boolean => {
  // Simulate business logic - some model assets have asset references
  const referencedIds = ['1', '2', '6'] // These have assets/documents referencing them
  return referencedIds.includes(modelAssetId)
}

export function getActiveModelAssetsByTracking(trackingType: 'Serial' | 'Lot' | 'None'): ModelAsset[] {
  return mockModelAssets.filter(ma => ma.status === 'Active' && ma.tracking_type === trackingType)
}