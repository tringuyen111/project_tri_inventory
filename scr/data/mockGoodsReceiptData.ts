import { GoodsReceipt, GoodsReceiptLine, GoodsReceiptActualRecord, GoodsReceiptWarning, GoodsReceiptAuditLog } from '../types/goodsReceipt'

export const mockGoodsReceiptLines: GoodsReceiptLine[] = [
  {
    id: '1',
    model_id: '1',
    model_code: 'LAP001',
    model_name: 'Dell Laptop Inspiron 15',
    uom_id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    tracking_type: 'Serial',
    qty_planned: 5,
    note: 'High priority items'
  },
  {
    id: '2',
    model_id: '2',
    model_code: 'MSE001',
    model_name: 'Logitech Wireless Mouse',
    uom_id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    tracking_type: 'Lot',
    qty_planned: 20,
    lot_no: 'LOT2024001'
  },
  {
    id: '3',
    model_id: '8',
    model_code: 'CBL001',
    model_name: 'USB-C Cable',
    uom_id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    tracking_type: 'None',
    qty_planned: 50
  }
]

// Mock actual receiving records
export const mockActualRecords: GoodsReceiptActualRecord[] = [
  {
    id: '1',
    gr_line_id: '5',
    tracking_type: 'Lot',
    qty_actual: 3,
    lot_no: 'LOT2024002',
    mfg_date: '2024-11-15',
    exp_date: '2026-11-15',
    bin_id: 'BIN001',
    bin_code: 'A01-01-01',
    bin_name: 'Zone A - Row 1 - Shelf 1',
    received_at: '2024-12-17T14:30:00Z',
    received_by: 'inventory_staff',
    notes: 'Goods in perfect condition'
  },
  {
    id: '2',
    gr_line_id: '6',
    tracking_type: 'None',
    qty_actual: 8,
    bin_id: 'BIN002',
    bin_code: 'A01-01-02',
    bin_name: 'Zone A - Row 1 - Shelf 2',
    received_at: '2024-12-17T14:35:00Z',
    received_by: 'inventory_staff'
  },
  {
    id: '3',
    gr_line_id: '7',
    tracking_type: 'Lot',
    qty_actual: 25,
    lot_no: 'LOT2024003',
    mfg_date: '2024-12-01',
    exp_date: '2026-12-01',
    bin_id: 'BIN003',
    bin_code: 'B02-01-01',
    bin_name: 'Zone B - Row 2 - Shelf 1',
    received_at: '2024-12-18T08:20:00Z',
    received_by: 'warehouse_staff',
    notes: 'First batch received'
  },
  {
    id: '4',
    gr_line_id: '7',
    tracking_type: 'Lot',
    qty_actual: 20,
    lot_no: 'LOT2024003',
    mfg_date: '2024-12-01',
    exp_date: '2026-12-01',
    bin_id: 'BIN004',
    bin_code: 'B02-01-02',
    bin_name: 'Zone B - Row 2 - Shelf 2',
    received_at: '2024-12-18T08:25:00Z',
    received_by: 'warehouse_staff',
    notes: 'Second batch, 5 units short due to damaged packaging'
  },
  {
    id: '5',
    gr_line_id: '8',
    tracking_type: 'Lot',
    qty_actual: 25,
    lot_no: 'LOT2024004',
    mfg_date: '2024-12-05',
    exp_date: '2027-12-05',
    bin_id: 'BIN005',
    bin_code: 'B02-01-03',
    bin_name: 'Zone B - Row 2 - Shelf 3',
    received_at: '2024-12-18T08:30:00Z',
    received_by: 'warehouse_staff',
    notes: 'Complete batch received'
  }
]

// Mock warnings for approval
export const mockWarnings: GoodsReceiptWarning[] = [
  {
    type: 'under_receipt',
    line_id: '7',
    model_name: 'Logitech Wireless Mouse',
    message: 'Received quantity (45) is less than planned (50)',
    blocking: false
  },
  {
    type: 'over_receipt',
    line_id: '9',
    model_name: 'Dell Laptop Inspiron 15',
    message: 'Received quantity (12) is more than planned (10)',
    blocking: false
  },
  {
    type: 'over_receipt',
    line_id: '11',
    model_name: 'USB-C Cable',
    message: 'Received quantity (13) is more than planned (10)',
    blocking: false
  }
]

// Mock audit logs
export const mockAuditLogs: GoodsReceiptAuditLog[] = [
  {
    id: '1',
    receipt_id: '4',
    action: 'created',
    user_id: 'inventory_staff',
    user_name: 'Inventory Staff',
    timestamp: '2024-12-12T13:15:00Z',
    details: 'Receipt created for found items during inventory count',
    ip_address: '192.168.1.100'
  },
  {
    id: '2',
    receipt_id: '4',
    action: 'submitted',
    user_id: 'inventory_staff',
    user_name: 'Inventory Staff',
    timestamp: '2024-12-17T10:30:00Z',
    details: 'Receipt submitted for approval after receiving completion',
    ip_address: '192.168.1.100'
  },
  {
    id: '3',
    receipt_id: '5',
    action: 'created',
    user_id: 'purchasing_manager',
    user_name: 'Purchasing Manager',
    timestamp: '2024-12-11T15:45:00Z',
    details: 'Receipt created from Purchase Order PO2024002',
    ip_address: '192.168.1.105'
  },
  {
    id: '4',
    receipt_id: '5',
    action: 'updated',
    user_id: 'warehouse_staff',
    user_name: 'Warehouse Staff',
    timestamp: '2024-12-18T08:20:00Z',
    details: 'Receiving process completed with partial quantities',
    ip_address: '192.168.1.102'
  },
  {
    id: '5',
    receipt_id: '5',
    action: 'submitted',
    user_id: 'warehouse_staff',
    user_name: 'Warehouse Staff',
    timestamp: '2024-12-18T09:30:00Z',
    details: 'Receipt submitted for approval with under-receipt warning',
    ip_address: '192.168.1.102'
  },
  {
    id: '6',
    receipt_id: '6',
    action: 'created',
    user_id: 'warehouse_manager',
    user_name: 'Warehouse Manager',
    timestamp: '2024-12-16T11:20:00Z',
    details: 'Receipt created from Transfer TR2024002',
    ip_address: '192.168.1.103'
  },
  {
    id: '7',
    receipt_id: '6',
    action: 'updated',
    user_id: 'warehouse_manager',
    user_name: 'Warehouse Manager',
    timestamp: '2024-12-18T13:45:00Z',
    details: 'Receiving process completed with over-receipt on some items',
    ip_address: '192.168.1.103'
  },
  {
    id: '8',
    receipt_id: '6',
    action: 'submitted',
    user_id: 'warehouse_manager',
    user_name: 'Warehouse Manager',
    timestamp: '2024-12-18T14:15:00Z',
    details: 'Receipt submitted for approval with over-receipt warning',
    ip_address: '192.168.1.103'
  }
]

export const mockGoodsReceipts: GoodsReceipt[] = [
  {
    id: '1',
    receipt_no: 'GR-WH01-202412-000001',
    receipt_type: 'PO',
    ref_no: 'PO2024001',
    partner_id: '1',
    partner_code: 'SUP001',
    partner_name: 'Dell Technologies',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-20',
    remark: 'IT equipment procurement for Q1',
    status: 'Draft',
    lines: [
      {
        id: '1',
        model_id: '1',
        model_code: 'LAP001',
        model_name: 'Dell Laptop Inspiron 15',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 5,
        note: 'High priority items'
      },
      {
        id: '2',
        model_id: '8',
        model_code: 'CBL001',
        model_name: 'USB-C Cable',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'None',
        qty_planned: 10
      }
    ],
    attachments: [],
    created_at: '2024-12-15T09:00:00Z',
    created_by: 'admin',
    updated_at: '2024-12-15T09:00:00Z',
    updated_by: 'admin'
  },
  {
    id: '2',
    receipt_no: 'GR-WH01-202412-000002',
    receipt_type: 'Transfer',
    ref_no: 'TR2024001',
    from_wh_id: '2',
    from_wh_code: 'WH02',
    from_wh_name: 'Branch Warehouse',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-18',
    remark: 'Monthly transfer from branch',
    status: 'Receiving',
    lines: [
      {
        id: '3',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 15,
        qty_received: 12,
        qty_remaining: 3,
        lot_no: 'LOT2024001',
        line_bin: 'A01-01-01',
        actual_records: [
          {
            id: '10',
            gr_line_id: '3',
            tracking_type: 'Lot',
            qty_actual: 8,
            lot_no: 'LOT2024001',
            mfg_date: '2024-11-01',
            exp_date: '2026-11-01',
            bin_id: 'BIN001',
            bin_code: 'A01-01-01',
            bin_name: 'Zone A - Row 1 - Shelf 1',
            received_at: '2024-12-18T10:15:00Z',
            received_by: 'warehouse_staff',
            notes: 'First batch received'
          },
          {
            id: '11',
            gr_line_id: '3',
            tracking_type: 'Lot',
            qty_actual: 4,
            lot_no: 'LOT2024001',
            mfg_date: '2024-11-01',
            exp_date: '2026-11-01',
            bin_id: 'BIN001',
            bin_code: 'A01-01-01',
            bin_name: 'Zone A - Row 1 - Shelf 1',
            received_at: '2024-12-18T10:20:00Z',
            received_by: 'warehouse_staff',
            notes: 'Second batch, partial quantity'
          }
        ]
      }
    ],
    attachments: [],
    created_at: '2024-12-14T14:30:00Z',
    created_by: 'warehouse_staff',
    updated_at: '2024-12-15T08:15:00Z',
    updated_by: 'warehouse_staff'
  },
  {
    id: '3',
    receipt_no: 'GR-WH02-202412-000001',
    receipt_type: 'Return',
    ref_no: 'RET2024001',
    partner_id: '3',
    partner_code: 'CUS001',
    partner_name: 'ABC Company',
    to_wh_id: '2',
    to_wh_code: 'WH02',
    to_wh_name: 'Branch Warehouse',
    expected_date: '2024-12-16',
    remark: 'Customer return - defective items',
    status: 'Completed',
    lines: [
      {
        id: '4',
        model_id: '1',
        model_code: 'LAP001',
        model_name: 'Dell Laptop Inspiron 15',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 1,
        note: 'Screen defect'
      }
    ],
    attachments: [],
    created_at: '2024-12-13T11:20:00Z',
    created_by: 'customer_service',
    updated_at: '2024-12-16T16:45:00Z',
    updated_by: 'warehouse_staff'
  },
  {
    id: '4',
    receipt_no: 'GR-WH01-202412-000003',
    receipt_type: 'Manual',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-17',
    remark: 'Found items during inventory count',
    status: 'Submitted',
    submitted_at: '2024-12-17T10:30:00Z',
    submitted_by: 'inventory_staff',
    total_lines: 2,
    total_qty_planned: 11,
    total_qty_received: 11,
    over_under_flag: 'exact',
    lines: [
      {
        id: '5',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 3,
        qty_received: 3,
        qty_remaining: 0,
        lot_no: 'LOT2024002',
        line_bin: 'A01-01-01',
        actual_records: [mockActualRecords[0]]
      },
      {
        id: '6',
        model_id: '8',
        model_code: 'CBL001',
        model_name: 'USB-C Cable',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'None',
        qty_planned: 8,
        qty_received: 8,
        qty_remaining: 0,
        line_bin: 'A01-01-02',
        actual_records: [mockActualRecords[1]]
      }
    ],
    attachments: [],
    created_at: '2024-12-12T13:15:00Z',
    created_by: 'inventory_staff',
    updated_at: '2024-12-17T10:30:00Z',
    updated_by: 'inventory_staff'
  },
  {
    id: '5',
    receipt_no: 'GR-WH02-202412-000002',
    receipt_type: 'PO',
    ref_no: 'PO2024002',
    partner_id: '2',
    partner_code: 'SUP002',
    partner_name: 'Logitech International',
    to_wh_id: '2',
    to_wh_code: 'WH02',
    to_wh_name: 'Branch Warehouse',
    expected_date: '2024-12-22',
    remark: 'Accessories bulk order',
    status: 'Submitted',
    submitted_at: '2024-12-18T09:30:00Z',
    submitted_by: 'warehouse_staff',
    total_lines: 2,
    total_qty_planned: 75,
    total_qty_received: 70,
    over_under_flag: 'under',
    lines: [
      {
        id: '7',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 50,
        qty_received: 45,
        qty_remaining: 5,
        lot_no: 'LOT2024003',
        line_bin: 'B02-01-01',
        note: 'Bulk order for resale',
        actual_records: [mockActualRecords[2], mockActualRecords[3]]
      },
      {
        id: '8',
        model_id: '3',
        model_code: 'KEY001',
        model_name: 'Logitech Wireless Keyboard',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 25,
        qty_received: 25,
        qty_remaining: 0,
        lot_no: 'LOT2024004',
        line_bin: 'B02-01-02',
        actual_records: [mockActualRecords[4]]
      }
    ],
    attachments: [],
    created_at: '2024-12-11T15:45:00Z',
    created_by: 'purchasing_manager',
    updated_at: '2024-12-18T09:30:00Z',
    updated_by: 'warehouse_staff'
  },
  {
    id: '6',
    receipt_no: 'GR-WH01-202412-000004',
    receipt_type: 'Transfer',
    ref_no: 'TR2024002',
    from_wh_id: '3',
    from_wh_code: 'WH03',
    from_wh_name: 'Storage Warehouse',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-19',
    remark: 'Monthly transfer for high-demand items',
    status: 'Submitted',
    submitted_at: '2024-12-18T14:15:00Z',
    submitted_by: 'warehouse_manager',
    total_lines: 3,
    total_qty_planned: 35,
    total_qty_received: 40,
    over_under_flag: 'over',
    lines: [
      {
        id: '9',
        model_id: '1',
        model_code: 'LAP001',
        model_name: 'Dell Laptop Inspiron 15',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 10,
        qty_received: 12,
        qty_remaining: 0,
        line_bin: 'A01-02-01',
        note: 'High demand product'
      },
      {
        id: '10',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 15,
        qty_received: 15,
        qty_remaining: 0,
        lot_no: 'LOT2024005',
        line_bin: 'A01-02-02'
      },
      {
        id: '11',
        model_id: '8',
        model_code: 'CBL001',
        model_name: 'USB-C Cable',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'None',
        qty_planned: 10,
        qty_received: 13,
        qty_remaining: 0,
        line_bin: 'A01-02-03'
      }
    ],
    attachments: [],
    created_at: '2024-12-16T11:20:00Z',
    created_by: 'warehouse_manager',
    updated_at: '2024-12-18T14:15:00Z',
    updated_by: 'warehouse_manager'
  },
  {
    id: '7',
    receipt_no: 'GR-WH01-202412-000005',
    receipt_type: 'PO',
    ref_no: 'PO2024003',
    partner_id: '1',
    partner_code: 'SUP001',
    partner_name: 'Dell Technologies',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-25',
    remark: 'End of year order',
    status: 'Receiving',
    lines: [
      {
        id: '12',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 20,
        qty_received: 18,
        qty_remaining: 2,
        lot_no: 'LOT2024006',
        line_bin: 'A01-03-01',
        actual_records: [
          {
            id: '12',
            gr_line_id: '12',
            tracking_type: 'Lot',
            qty_actual: 10,
            lot_no: 'LOT2024006',
            mfg_date: '2024-12-10',
            exp_date: '2026-12-10',
            bin_id: 'BIN006',
            bin_code: 'A01-03-01',
            bin_name: 'Zone A - Row 3 - Shelf 1',
            received_at: '2024-12-20T14:30:00Z',
            received_by: 'warehouse_staff',
            notes: 'First batch received'
          },
          {
            id: '13',
            gr_line_id: '12',
            tracking_type: 'Lot',
            qty_actual: 8,
            lot_no: 'LOT2024006',
            mfg_date: '2024-12-10',
            exp_date: '2026-12-10',
            bin_id: 'BIN006',
            bin_code: 'A01-03-01',
            bin_name: 'Zone A - Row 3 - Shelf 1',
            received_at: '2024-12-20T14:35:00Z',
            received_by: 'warehouse_staff',
            notes: 'Second batch, 2 units damaged'
          }
        ]
      },
      {
        id: '13',
        model_id: '8',
        model_code: 'CBL001',
        model_name: 'USB-C Cable',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'None',
        qty_planned: 15,
        qty_received: 15,
        qty_remaining: 0,
        line_bin: 'A01-03-02',
        actual_records: [
          {
            id: '14',
            gr_line_id: '13',
            tracking_type: 'None',
            qty_actual: 15,
            bin_id: 'BIN007',
            bin_code: 'A01-03-02',
            bin_name: 'Zone A - Row 3 - Shelf 2',
            received_at: '2024-12-20T15:00:00Z',
            received_by: 'warehouse_staff',
            notes: 'Complete quantity received'
          }
        ]
      }
    ],
    attachments: [],
    created_at: '2024-12-18T10:00:00Z',
    created_by: 'purchasing_manager',
    updated_at: '2024-12-20T15:00:00Z',
    updated_by: 'warehouse_staff'
  },
  {
    id: '8',
    receipt_no: 'GR-WH01-202412-000006',
    receipt_type: 'PO',
    ref_no: 'PO2024004',
    partner_id: '2',
    partner_code: 'SUP002',
    partner_name: 'Logitech International',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-28',
    remark: 'Year-end bulk order with special pricing',
    status: 'Submitted',
    submitted_at: '2024-12-21T16:45:00Z',
    submitted_by: 'John Smith (Warehouse Staff)',
    submit_note: 'All items received in good condition. Minor under-receipt on keyboards due to supplier shortage. Recommend approval for business continuity.',
    total_lines: 3,
    total_qty_planned: 80,
    total_qty_received: 78,
    over_under_flag: 'under',
    lines: [
      {
        id: '14',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 30,
        qty_received: 30,
        qty_remaining: 0,
        lot_no: 'LOT2024007',
        line_bin: 'A02-01-01',
        actual_records: [
          {
            id: '15',
            gr_line_id: '14',
            tracking_type: 'Lot',
            qty_actual: 30,
            lot_no: 'LOT2024007',
            mfg_date: '2024-12-15',
            exp_date: '2026-12-15',
            bin_id: 'BIN008',
            bin_code: 'A02-01-01',
            bin_name: 'Zone A - Row 2 - Shelf 1',
            received_at: '2024-12-21T14:00:00Z',
            received_by: 'John Smith',
            notes: 'Complete batch received, excellent quality'
          }
        ]
      },
      {
        id: '15',
        model_id: '3',
        model_code: 'KEY001',
        model_name: 'Logitech Wireless Keyboard',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 25,
        qty_received: 23,
        qty_remaining: 2,
        lot_no: 'LOT2024008',
        line_bin: 'A02-01-02',
        actual_records: [
          {
            id: '16',
            gr_line_id: '15',
            tracking_type: 'Lot',
            qty_actual: 23,
            lot_no: 'LOT2024008',
            mfg_date: '2024-12-14',
            exp_date: '2026-12-14',
            bin_id: 'BIN009',
            bin_code: 'A02-01-02',
            bin_name: 'Zone A - Row 2 - Shelf 2',
            received_at: '2024-12-21T14:30:00Z',
            received_by: 'John Smith',
            notes: '2 units short due to supplier manufacturing delay'
          }
        ]
      },
      {
        id: '16',
        model_id: '8',
        model_code: 'CBL001',
        model_name: 'USB-C Cable',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'None',
        qty_planned: 25,
        qty_received: 25,
        qty_remaining: 0,
        line_bin: 'A02-01-03',
        actual_records: [
          {
            id: '17',
            gr_line_id: '16',
            tracking_type: 'None',
            qty_actual: 25,
            bin_id: 'BIN010',
            bin_code: 'A02-01-03',
            bin_name: 'Zone A - Row 2 - Shelf 3',
            received_at: '2024-12-21T15:00:00Z',
            received_by: 'John Smith',
            notes: 'Full quantity received, high-quality cables'
          }
        ]
      }
    ],
    attachments: [],
    created_at: '2024-12-19T09:30:00Z',
    created_by: 'purchasing_manager',
    updated_at: '2024-12-21T16:45:00Z',
    updated_by: 'John Smith'
  },
  {
    id: '9',
    receipt_no: 'GR-WH01-202412-000007',
    receipt_type: 'PO',
    ref_no: 'PO2024005',
    partner_id: '1',
    partner_code: 'SUP001',
    partner_name: 'Dell Technologies',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    expected_date: '2024-12-22',
    remark: 'IT equipment for new branch setup',
    status: 'Completed',
    submitted_at: '2024-12-20T14:30:00Z',
    submitted_by: 'warehouse_staff',
    submit_note: 'All equipment received and quality checked. Ready for branch deployment.',
    approved_at: '2024-12-21T09:15:00Z',
    approved_by: 'warehouse_manager',
    approval_note: 'Approved for immediate deployment. Quality verification completed successfully.',
    completed_at: '2024-12-21T16:30:00Z',
    completed_by: 'inventory_supervisor',
    total_lines: 3,
    total_qty_planned: 40,
    total_qty_received: 40,
    over_under_flag: 'exact',
    lines: [
      {
        id: '17',
        model_id: '1',
        model_code: 'LAP001',
        model_name: 'Dell Laptop Inspiron 15',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 10,
        qty_received: 10,
        qty_remaining: 0,
        line_bin: 'A03-01-01',
        note: 'High-priority deployment items',
        actual_records: [
          {
            id: '18',
            gr_line_id: '17',
            tracking_type: 'Serial',
            qty_actual: 10,
            serial_no: 'DL240001,DL240002,DL240003,DL240004,DL240005,DL240006,DL240007,DL240008,DL240009,DL240010',
            bin_id: 'BIN011',
            bin_code: 'A03-01-01',
            bin_name: 'Zone A - Row 3 - Shelf 1',
            received_at: '2024-12-20T10:30:00Z',
            received_by: 'warehouse_staff',
            notes: 'All laptops quality tested and tagged'
          }
        ]
      },
      {
        id: '18',
        model_id: '2',
        model_code: 'MSE001',
        model_name: 'Logitech Wireless Mouse',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 15,
        qty_received: 15,
        qty_remaining: 0,
        lot_no: 'LOT2024009',
        line_bin: 'A03-01-02',
        actual_records: [
          {
            id: '19',
            gr_line_id: '18',
            tracking_type: 'Lot',
            qty_actual: 15,
            lot_no: 'LOT2024009',
            mfg_date: '2024-12-18',
            exp_date: '2026-12-18',
            bin_id: 'BIN012',
            bin_code: 'A03-01-02',
            bin_name: 'Zone A - Row 3 - Shelf 2',
            received_at: '2024-12-20T11:00:00Z',
            received_by: 'warehouse_staff',
            notes: 'Excellent condition, ready for immediate use'
          }
        ]
      },
      {
        id: '19',
        model_id: '3',
        model_code: 'KEY001',
        model_name: 'Logitech Wireless Keyboard',
        uom_id: '1',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Lot',
        qty_planned: 15,
        qty_received: 15,
        qty_remaining: 0,
        lot_no: 'LOT2024010',
        line_bin: 'A03-01-03',
        actual_records: [
          {
            id: '20',
            gr_line_id: '19',
            tracking_type: 'Lot',
            qty_actual: 15,
            lot_no: 'LOT2024010',
            mfg_date: '2024-12-18',
            exp_date: '2026-12-18',
            bin_id: 'BIN013',
            bin_code: 'A03-01-03',
            bin_name: 'Zone A - Row 3 - Shelf 3',
            received_at: '2024-12-20T11:30:00Z',
            received_by: 'warehouse_staff',
            notes: 'Perfect match with mouse lot, boxed together'
          }
        ]
      }
    ],
    attachments: [],
    created_at: '2024-12-18T08:45:00Z',
    created_by: 'purchasing_manager',
    updated_at: '2024-12-21T16:30:00Z',
    updated_by: 'inventory_supervisor'
  }
]

// Helper function to generate receipt number
export function generateReceiptNumber(warehouseCode: string): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  
  // Get existing receipts for this warehouse and month to determine sequence
  const prefix = `GR-${warehouseCode}-${year}${month}-`
  const existingReceipts = mockGoodsReceipts.filter(r => r.receipt_no.startsWith(prefix))
  const sequence = existingReceipts.length + 1
  
  return `${prefix}${String(sequence).padStart(6, '0')}`
}