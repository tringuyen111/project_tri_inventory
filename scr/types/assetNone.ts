export interface AssetNone {
  id: string
  model_code: string
  model_name?: string // For display purposes
  uom_code?: string // Unit of Measure code from model asset
  uom_name?: string // Unit of Measure name for display
  wh_code: string
  wh_name?: string // For display purposes
  location_code: string
  location_name?: string // For display purposes
  qty_onhand: number // System calculated quantity
  status: 'Active' | 'Inactive'
  created_date: string
  updated_date: string
}

export interface AssetNoneFormData {
  model_code: string
  wh_code: string
  location_code: string
  status: 'Active' | 'Inactive'
}

export interface AssetNoneUpdateData {
  status: 'Active' | 'Inactive'
}

export const ASSET_NONE_STATUSES = ['Active', 'Inactive'] as const
export type AssetNoneStatus = typeof ASSET_NONE_STATUSES[number]