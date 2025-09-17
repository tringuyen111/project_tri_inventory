export interface GoodsIssueLine {
  line_id: string
  sku: string
  product_name: string
  planned_qty: number
  picked_qty: number
  uom: string
}

export interface GoodsIssue {
  issue_no: string
  issue_type: 'Sales Order' | 'Transfer' | 'Return' | 'Manual'
  status: 'Draft' | 'Picking' | 'Picked' | 'Completed' | 'Cancelled'
  partner_name?: string
  from_wh_name: string
  to_wh_name?: string
  expected_date: string
  created_at: string
  created_by: string
  lines: GoodsIssueLine[]
}
