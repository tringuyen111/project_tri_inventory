export interface GoodsIssueLine {
  id: string
  model_id: string
  model_code: string
  model_name: string
  uom_id: string
  uom_code: string
  uom_name: string
  tracking_type: 'None' | 'Lot' | 'Serial'
  qty_planned: number
  qty_issued?: number
  qty_remaining?: number
  note?: string
  bin_code?: string
  serial_list?: string[]
  lot_no?: string
  mfg_date?: string
  exp_date?: string
}

export interface GoodsIssueAttachment {
  id: string
  filename: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export interface GoodsIssue {
  id: string
  issue_no: string
  issue_type: 'SO' | 'Transfer' | 'Return' | 'Manual' | 'Production'
  ref_no?: string
  partner_id?: string
  partner_code?: string
  partner_name?: string
  request_dept?: string
  from_wh_id: string
  from_wh_code: string
  from_wh_name: string
  to_wh_id?: string
  to_wh_code?: string
  to_wh_name?: string
  issue_date: string
  remark?: string
  status: 'Draft' | 'Picking' | 'Submitted' | 'Completed' | 'Cancelled'
  lines: GoodsIssueLine[]
  attachments: GoodsIssueAttachment[]
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  submitted_at?: string
  submitted_by?: string
  submit_note?: string
  approved_at?: string
  approved_by?: string
  approved_note?: string
  cancelled_at?: string
  cancelled_by?: string
  cancelled_reason?: string
}
