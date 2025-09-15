export interface Lot {
  lot_code: string
  model_code: string
  model_name?: string
  uom_code?: string // Unit of Measure code from model asset
  uom_name?: string // Unit of Measure name for display
  wh_code: string
  wh_name?: string
  loc_code: string
  loc_name?: string
  received_date: string
  mfg_date?: string
  exp_date?: string
  status: 'Active' | 'Inactive'
  qty_onhand: number
  created_at?: string
  updated_at?: string
}

export interface LotFormData {
  lot_code: string
  model_code: string
  wh_code: string
  loc_code: string
  received_date: string
  mfg_date?: string
  exp_date?: string
  status: 'Active' | 'Inactive'
}