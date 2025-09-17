import { GoodsIssue } from '../types/goodsIssue'

export const mockGoodsIssues: GoodsIssue[] = [
  {
    id: 'gi-2024-001',
    issue_no: 'GI-2024-001',
    issue_type: 'SO',
    ref_no: 'SO-2024-145',
    partner_id: 'partner-001',
    partner_code: 'CUS-001',
    partner_name: 'Acme Retailers',
    from_wh_id: 'wh-001',
    from_wh_code: 'HCM-A',
    from_wh_name: 'Ho Chi Minh Central Warehouse',
    to_wh_id: 'store-01',
    to_wh_code: 'STORE-01',
    to_wh_name: 'District 1 Flagship Store',
    issue_date: '2024-05-03',
    status: 'Submitted',
    remark: 'Priority order for weekend campaign',
    lines: [
      {
        id: 'gi-line-001',
        model_id: 'mod-001',
        model_code: 'SKU-001',
        model_name: 'Industrial Drill',
        uom_id: 'uom-001',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 25,
        qty_issued: 20,
        qty_remaining: 5,
        serial_list: ['SN-1001', 'SN-1002', 'SN-1003'],
        note: 'Remaining serials pending inspection'
      },
      {
        id: 'gi-line-002',
        model_id: 'mod-002',
        model_code: 'SKU-002',
        model_name: 'Protective Gloves',
        uom_id: 'uom-002',
        uom_code: 'BOX',
        uom_name: 'Box',
        tracking_type: 'None',
        qty_planned: 60,
        qty_issued: 60
      }
    ],
    attachments: [
      {
        id: 'gi-att-001',
        filename: 'delivery-note.pdf',
        file_size: 256000,
        file_type: 'application/pdf',
        uploaded_at: '2024-05-03T08:15:00Z'
      }
    ],
    created_at: '2024-05-02T09:20:00Z',
    created_by: 'Trung Nguyen',
    updated_at: '2024-05-03T10:45:00Z',
    updated_by: 'Linh Tran',
    submitted_at: '2024-05-03T08:00:00Z',
    submitted_by: 'Linh Tran',
    submit_note: 'Submit for shipping schedule',
    approved_at: '2024-05-03T09:00:00Z',
    approved_by: 'Khoi Le',
    approved_note: 'Approved with partial shipment'
  },
  {
    id: 'gi-2024-002',
    issue_no: 'GI-2024-002',
    issue_type: 'Transfer',
    ref_no: 'TR-2024-023',
    request_dept: 'Warehouse Operations',
    from_wh_id: 'wh-001',
    from_wh_code: 'HCM-A',
    from_wh_name: 'Ho Chi Minh Central Warehouse',
    to_wh_id: 'wh-002',
    to_wh_code: 'HNI-B',
    to_wh_name: 'Hanoi Regional Warehouse',
    issue_date: '2024-05-05',
    status: 'Picking',
    lines: [
      {
        id: 'gi-line-003',
        model_id: 'mod-003',
        model_code: 'SKU-045',
        model_name: 'Steel Beams',
        uom_id: 'uom-003',
        uom_code: 'TON',
        uom_name: 'Ton',
        tracking_type: 'Lot',
        qty_planned: 15,
        qty_issued: 8,
        qty_remaining: 7,
        lot_no: 'LOT-STEEL-2304'
      }
    ],
    attachments: [],
    created_at: '2024-05-04T07:30:00Z',
    created_by: 'Phuc Nguyen',
    updated_at: '2024-05-05T06:40:00Z',
    updated_by: 'Phuc Nguyen'
  },
  {
    id: 'gi-2024-003',
    issue_no: 'GI-2024-003',
    issue_type: 'Manual',
    request_dept: 'Maintenance',
    from_wh_id: 'wh-003',
    from_wh_code: 'DN-C',
    from_wh_name: 'Da Nang Maintenance Warehouse',
    issue_date: '2024-05-06',
    status: 'Draft',
    remark: 'Urgent maintenance task for production line 2',
    lines: [
      {
        id: 'gi-line-004',
        model_id: 'mod-004',
        model_code: 'SKU-300',
        model_name: 'Hydraulic Pump',
        uom_id: 'uom-001',
        uom_code: 'PCS',
        uom_name: 'Pieces',
        tracking_type: 'Serial',
        qty_planned: 2
      },
      {
        id: 'gi-line-005',
        model_id: 'mod-005',
        model_code: 'SKU-305',
        model_name: 'Seal Kit',
        uom_id: 'uom-004',
        uom_code: 'SET',
        uom_name: 'Set',
        tracking_type: 'None',
        qty_planned: 4
      }
    ],
    attachments: [],
    created_at: '2024-05-05T13:10:00Z',
    created_by: 'Lan Pham',
    updated_at: '2024-05-05T13:10:00Z',
    updated_by: 'Lan Pham'
  },
  {
    id: 'gi-2024-004',
    issue_no: 'GI-2024-004',
    issue_type: 'Production',
    ref_no: 'MO-2024-011',
    request_dept: 'Production',
    from_wh_id: 'wh-004',
    from_wh_code: 'BTH-D',
    from_wh_name: 'Binh Thuan Production Warehouse',
    to_wh_id: 'line-3',
    to_wh_code: 'LINE-3',
    to_wh_name: 'Assembly Line 3',
    issue_date: '2024-05-04',
    status: 'Completed',
    lines: [
      {
        id: 'gi-line-006',
        model_id: 'mod-006',
        model_code: 'SKU-550',
        model_name: 'Aluminum Sheets',
        uom_id: 'uom-005',
        uom_code: 'KG',
        uom_name: 'Kilogram',
        tracking_type: 'Lot',
        qty_planned: 1200,
        qty_issued: 1200,
        lot_no: 'LOT-AL-2404'
      }
    ],
    attachments: [
      {
        id: 'gi-att-002',
        filename: 'production-request.docx',
        file_size: 98000,
        file_type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        uploaded_at: '2024-05-02T04:20:00Z'
      }
    ],
    created_at: '2024-05-02T04:00:00Z',
    created_by: 'Huy Nguyen',
    updated_at: '2024-05-04T03:55:00Z',
    updated_by: 'Huy Nguyen',
    submitted_at: '2024-05-02T05:10:00Z',
    submitted_by: 'Huy Nguyen',
    approved_at: '2024-05-02T06:05:00Z',
    approved_by: 'Thu Nguyen'
  },
  {
    id: 'gi-2024-005',
    issue_no: 'GI-2024-005',
    issue_type: 'Return',
    ref_no: 'RT-2024-009',
    partner_id: 'partner-002',
    partner_code: 'SUP-022',
    partner_name: 'Global Supplies Ltd',
    from_wh_id: 'wh-002',
    from_wh_code: 'HNI-B',
    from_wh_name: 'Hanoi Regional Warehouse',
    to_wh_id: 'partner-002',
    to_wh_code: 'SUP-022',
    to_wh_name: 'Global Supplies Ltd - Main Hub',
    issue_date: '2024-05-01',
    status: 'Cancelled',
    remark: 'Return request cancelled by supplier due to replacement shipment',
    lines: [
      {
        id: 'gi-line-007',
        model_id: 'mod-007',
        model_code: 'SKU-780',
        model_name: 'Packaging Foam',
        uom_id: 'uom-006',
        uom_code: 'ROLL',
        uom_name: 'Roll',
        tracking_type: 'None',
        qty_planned: 45
      }
    ],
    attachments: [],
    created_at: '2024-04-29T11:45:00Z',
    created_by: 'An Bui',
    updated_at: '2024-05-01T09:20:00Z',
    updated_by: 'An Bui',
    cancelled_at: '2024-05-01T09:15:00Z',
    cancelled_by: 'An Bui',
    cancelled_reason: 'Supplier confirmed replacement shipment'
  }
]
