export type GoodsIssueTrackingType = 'None' | 'Lot' | 'Serial'

export interface GoodsIssueLine {
  id: string
  model_id: string
  model_code: string
  model_name: string
  uom_id: string
  uom_code: string
  uom_name: string
  tracking_type: GoodsIssueTrackingType
  qty_planned: number
  note?: string
  serial_numbers?: string[]
  lot_no?: string
  mfg_date?: string
  exp_date?: string
}

export interface GoodsIssue {
  id: string
  issue_no: string
  issue_type: 'SO' | 'Transfer' | 'Return' | 'Consumption'
  ref_no?: string
  partner_id?: string
  partner_code?: string
  partner_name?: string
  from_wh_id: string
  from_wh_code: string
  from_wh_name: string
  to_wh_id?: string
  to_wh_code?: string
  to_wh_name?: string
  planned_date: string
  remark?: string
  status: 'Draft' | 'Picking' | 'Submitted' | 'Completed' | 'Cancelled'
  lines: GoodsIssueLine[]
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
}

export interface GoodsIssueFormLine {
  model_id: string
  uom_id: string
  tracking_type: GoodsIssueTrackingType
  qty_planned: number
  note?: string
  serial_numbers?: string[]
  lot_no?: string
  mfg_date?: string
  exp_date?: string
}

export interface GoodsIssueFormData {
  issue_type: 'SO' | 'Transfer' | 'Return' | 'Consumption'
  ref_no?: string
  partner_id?: string
  from_wh_id: string
  to_wh_id?: string
  planned_date: string
  remark?: string
  lines: GoodsIssueFormLine[]
}

export interface GoodsIssueAuditLog {
  id: string
  issue_id: string
  action: 'created' | 'updated' | 'exported' | 'imported'
  user_id: string
  user_name: string
  timestamp: string
  details: string
  metadata?: Record<string, unknown>
}
