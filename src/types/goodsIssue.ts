export type GoodsIssueType = 'SO' | 'Transfer' | 'ReturnToSupplier' | 'Adjustment' | 'Manual'

export type GoodsIssueStatus =
  | 'Draft'
  | 'Picking'
  | 'AdjustmentRequested'
  | 'Submitted'
  | 'Approved'
  | 'Completed'
  | 'Cancelled'

export interface GoodsIssueAttachment {
  id: string
  filename: string
  file_size: number
  file_type: string
  uploaded_at: string
  uploaded_by: string
}

export interface GoodsIssueHistory {
  id: string
  status: GoodsIssueStatus
  action: string
  actor: string
  timestamp: string
  remark?: string
}

export interface GoodsIssuePickingRecord {
  id: string
  line_id: string
  tracking_type: 'Serial' | 'Lot' | 'None'
  serial_no?: string
  lot_no?: string
  qty_picked?: number
  received_date?: string
  location_code?: string
  picked_by: string
  picked_at: string
  note?: string
}

export interface GoodsIssueLine {
  id: string
  model_id: string
  model_code: string
  model_name: string
  uom_id: string
  uom_code: string
  uom_name: string
  tracking_type: 'Serial' | 'Lot' | 'None'
  qty_planned: number
  qty_picked: number
  issue_method: 'Model' | 'Serial' | 'Lot'
  difference: number
  status: 'Pending' | 'Picking' | 'Completed' | 'Shortage'
  remarks?: string
  pickings: GoodsIssuePickingRecord[]
}

export interface GoodsIssue {
  id: string
  gi_no: string
  issue_type: GoodsIssueType
  issue_method: 'Model' | 'Serial' | 'Lot'
  from_wh_id: string
  from_wh_code: string
  from_wh_name: string
  to_wh_id?: string
  to_wh_code?: string
  to_wh_name?: string
  partner_id?: string
  partner_code?: string
  partner_name?: string
  expected_date: string
  remark?: string
  status: GoodsIssueStatus
  created_by: string
  created_at: string
  submitted_by?: string
  submitted_at?: string
  approved_by?: string
  approved_at?: string
  completed_at?: string
  cancelled_at?: string
  lines: GoodsIssueLine[]
  attachments: GoodsIssueAttachment[]
  histories: GoodsIssueHistory[]
}
