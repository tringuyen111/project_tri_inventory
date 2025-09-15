export interface Asset {
  id: string
  asset_id: string // System generated unique ID
  model_code: string
  model_name?: string // For display purposes
  uom_code?: string // Unit of Measure code from model asset
  uom_name?: string // Unit of Measure name for display
  serial_number: string
  wh_code: string
  wh_name?: string // For display purposes
  location_code: string
  location_name?: string // For display purposes
  partner_code?: string
  partner_name?: string // For display purposes
  status: 'InStock' | 'Issued' | 'Disposed' | 'Lost'
  created_date: string
  updated_date: string
}

export interface AssetFormData {
  model_code: string
  serial_numbers: string // Multi-line input for batch creation
  wh_code: string
  location_code: string
  partner_code?: string
  status: 'InStock' | 'Issued' | 'Disposed' | 'Lost'
}

export interface AssetUpdateData {
  wh_code: string
  location_code: string
  partner_code?: string
  status: 'InStock' | 'Issued' | 'Disposed' | 'Lost'
}

export interface AssetHistory {
  id: string
  asset_id: string
  action: 'Created' | 'StatusChanged' | 'LocationChanged' | 'WarehouseChanged' | 'PartnerAssigned'
  old_value?: string
  new_value?: string
  timestamp: string
  user_id?: string
}

export const ASSET_STATUSES = ['InStock', 'Issued', 'Disposed', 'Lost'] as const