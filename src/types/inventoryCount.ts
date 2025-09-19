export type InventoryCountStatus =
  | 'Draft'
  | 'Counting'
  | 'Submitted'
  | 'Completed'
  | 'Cancelled'

export type InventoryCountScopeType = 'Warehouse' | 'Location' | 'Model'

export type InventoryCountTrackingType = 'Serial' | 'Lot' | 'None'

export interface InventoryCountLine {
  line_id: string
  count_id: string
  model_id: string
  model_name: string
  location_id: string
  location_name: string
  uom_id: string
  uom_name: string
  tracking_type: InventoryCountTrackingType
  system_qty: number
  counted_qty: number | null
  diff_qty?: number | null
  is_zeroed: boolean
  is_unlisted: boolean
  remark?: string
}

export interface InventoryCountDetail {
  detail_id: string
  line_id: string
  serial_no?: string
  lot_no?: string
  qty: number
  location_id: string
  location_name: string
  scanned_by: string
  scanned_at: string
  is_unlisted: boolean
}

export interface InventoryCountAuditEntry {
  id: string
  action: string
  actor: string
  role: string
  timestamp: string
  note?: string
}

export interface InventoryCount {
  count_id: string
  wh_id: string
  wh_name: string
  scope_type: InventoryCountScopeType
  location_list: Array<{ id: string; name: string }>
  model_list: Array<{ id: string; name: string; tracking_type: InventoryCountTrackingType }>
  blind_mode: boolean
  status: InventoryCountStatus
  snapshot_at: string
  created_by: string
  created_at: string
  submitted_by?: string
  submitted_at?: string
  completed_by?: string
  completed_at?: string
  note?: string
  zero_required_locations: string[]
  zero_completed_locations: string[]
  lines: InventoryCountLine[]
  details: InventoryCountDetail[]
  audit_trail: InventoryCountAuditEntry[]
  variance_report_url?: string
}
