export interface ModelAsset {
  id: string
  model_code: string
  model_name: string
  asset_type_code: string
  asset_type_name?: string // For display purposes
  tracking_type: 'Serial' | 'Lot' | 'None'
  uom_code: string
  uom_name?: string // For display purposes
  description?: string
  status: 'Active' | 'Inactive'
  created_date: string
  updated_date: string
}

export interface ModelAssetFormData {
  model_code: string
  model_name: string
  asset_type_code: string
  tracking_type: 'Serial' | 'Lot' | 'None'
  uom_code: string
  description: string
  status: 'Active' | 'Inactive'
}

export const TRACKING_TYPES = ['Serial', 'Lot', 'None'] as const
export type TrackingType = typeof TRACKING_TYPES[number]