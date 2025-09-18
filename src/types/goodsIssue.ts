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
  issue_type: 'SO' | 'Transfer' | 'ReturnToSupplier' | 'Adjustment' | 'Manual'
  status:
    | 'Draft'
    | 'Picking'
    | 'AdjustmentRequested'
    | 'Submitted'
    | 'Approved'
    | 'Completed'
    | 'Cancelled'
  partner_name?: string
  related_entry?: string
  partner_address?: string
  remarks?: string
  from_wh_name: string
  to_wh_name?: string
  expected_date: string
  created_at: string
  created_by: string
  lines: GoodsIssueLine[]
}
