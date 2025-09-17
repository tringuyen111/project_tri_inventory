export interface GoodsIssueLine {
  id: string
  issue_id: string
  line_id: string
  product_id: string
  product_code: string
  sku: string
  product_name: string
  uom_id: string
  uom: string
  tracking_type: 'None' | 'Lot' | 'Serial'
  planned_qty: number
  picked_qty: number
  remark?: string
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
  issue_type: 'Sales Order' | 'Transfer' | 'Return' | 'Manual'
  issue_method: 'Manual' | 'System' | 'Mobile'
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
  expected_date: string
  remark?: string
  status: 'Draft' | 'Picking' | 'Picked' | 'Completed' | 'Cancelled'
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
