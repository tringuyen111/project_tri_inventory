export interface GoodsReceiptLine {
  id: string
  model_id: string
  model_code: string
  model_name: string
  uom_id: string
  uom_code: string
  uom_name: string
  tracking_type: 'None' | 'Lot' | 'Serial'
  qty_planned: number
  qty_received?: number
  qty_remaining?: number
  note?: string
  line_bin?: string
  // For tracking purposes
  serial_list?: string[]
  lot_no?: string
  mfg_date?: string
  exp_date?: string
  // Actual receiving records
  actual_records?: GoodsReceiptActualRecord[]
}

export interface GoodsReceiptActualRecord {
  id: string
  gr_line_id: string
  tracking_type: 'None' | 'Lot' | 'Serial'
  qty_actual?: number
  barcode?: string
  lot_no?: string
  mfg_date?: string
  exp_date?: string
  bin_id?: string
  bin_code?: string
  bin_name?: string
  received_at: string
  received_by: string
  notes?: string
}

export interface GoodsReceiptAttachment {
  id: string
  filename: string
  file_size: number
  file_type: string
  uploaded_at: string
}

export interface GoodsReceipt {
  id: string
  receipt_no: string
  receipt_type: 'PO' | 'Transfer' | 'Return' | 'Manual'
  ref_no?: string
  partner_id?: string
  partner_code?: string
  partner_name?: string
  from_wh_id?: string
  from_wh_code?: string
  from_wh_name?: string
  to_wh_id: string
  to_wh_code: string
  to_wh_name: string
  expected_date: string
  remark?: string
  status: 'Draft' | 'Receiving' | 'Submitted' | 'Completed' | 'Rejected' | 'Cancelled'
  lines: GoodsReceiptLine[]
  attachments: GoodsReceiptAttachment[]
  created_at: string
  created_by: string
  updated_at: string
  updated_by: string
  // Approval workflow fields
  submitted_at?: string
  submitted_by?: string
  submit_note?: string
  approved_at?: string
  approved_by?: string
  approved_note?: string
  rejected_at?: string
  rejected_by?: string
  rejected_reason?: string
  cancelled_at?: string
  cancelled_by?: string
  cancelled_reason?: string
  // Summary calculations
  total_lines?: number
  total_qty_planned?: number
  total_qty_received?: number
  over_under_flag?: 'over' | 'under' | 'exact'
}

export interface GoodsReceiptFormData {
  receipt_type: 'PO' | 'Transfer' | 'Return' | 'Manual'
  ref_no?: string
  partner_id?: string
  from_wh_id?: string
  to_wh_id: string
  expected_date: string
  remark?: string
  lines: Omit<GoodsReceiptLine, 'id' | 'model_code' | 'model_name' | 'uom_code' | 'uom_name'>[]
  attachments: File[]
}

export interface GoodsReceiptImportData {
  model_code: string
  uom_code: string
  tracking_type: 'None' | 'Lot' | 'Serial'
  qty_planned: number
  note?: string
  serial_list?: string
  lot_no?: string
  mfg_date?: string
  exp_date?: string
}

export interface GoodsReceiptValidationError {
  line: number
  field: string
  message: string
}

export interface GoodsReceiptWarning {
  type: 'over_receipt' | 'under_receipt' | 'duplicate_barcode' | 'missing_lot_info' | 'invalid_bin'
  line_id?: string
  model_name?: string
  message: string
  blocking: boolean
}

export interface GoodsReceiptAuditLog {
  id: string
  receipt_id: string
  action: 'created' | 'updated' | 'submitted' | 'approved' | 'rejected' | 'cancelled' | 'reversed'
  user_id: string
  user_name: string
  timestamp: string
  details: string
  ip_address?: string
  before_data?: any
  after_data?: any
}