export type GoodsIssueStatus =
  | 'Draft'
  | 'Picking'
  | 'AdjustmentRequested'
  | 'Submitted'
  | 'Approved'
  | 'Completed'
  | 'Cancelled'

export type GoodsIssueTrackingType = 'NONE' | 'LOT' | 'SERIAL'

export interface GoodsIssueLineLotAllocation {
  lotNumber: string
  quantity: number
}

export interface GoodsIssueLine {
  line_id: string
  sku: string
  product_name: string
  planned_qty: number
  picked_qty: number
  uom: string
  tracking_type: GoodsIssueTrackingType
  serials: string[]
  lot_allocations: GoodsIssueLineLotAllocation[]
}

export interface GoodsIssueStatusHistoryEntry {
  status: GoodsIssueStatus
  changedAt: string
  changedBy: string
  note?: string
}

export interface GoodsIssue {
  issue_no: string
  issue_type: 'Sales Order' | 'Transfer' | 'Return' | 'Manual'
  status: GoodsIssueStatus
  partner_name?: string
  from_wh_name: string
  to_wh_name?: string
  expected_date: string
  created_at: string
  created_by: string
  statusHistory: GoodsIssueStatusHistoryEntry[]
  lines: GoodsIssueLine[]
}

export interface GoodsIssueDraftLineInput {
  line_id?: string
  sku: string
  product_name: string
  planned_qty: number
  uom: string
  tracking_type: GoodsIssueTrackingType
}

export interface GoodsIssueDraftPayload {
  issue_type: GoodsIssue['issue_type']
  partner_name?: string
  from_wh_name: string
  to_wh_name?: string
  expected_date: string
  lines: GoodsIssueDraftLineInput[]
}

export interface GoodsIssueLotAssignment {
  lotNumber: string
  quantity: number
  availableQty?: number
}

export interface GoodsIssueTransitionOptions {
  note?: string
  changedBy?: string
}
