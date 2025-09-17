import { GoodsIssue, GoodsIssueHistory, GoodsIssueLine, GoodsIssuePickingRecord } from '../types/goodsIssue'
import { mockModelAssets } from './mockModelAssetData'
import { mockWarehouses } from './mockWarehouseData'
import { mockPartners } from './mockPartnerData'
import { mockUoMs } from './mockUomData'

const findModel = (modelCode: string) => mockModelAssets.find(model => model.model_code === modelCode)
const findWarehouse = (code: string) => mockWarehouses.find(wh => wh.code === code)
const findPartner = (code: string) => mockPartners.find(partner => partner.partner_code === code)
const findUom = (code: string) => mockUoMs.find(uom => uom.uom_code === code)

const createSerialPickings = (lineId: string, serials: string[]): GoodsIssuePickingRecord[] =>
  serials.map((serial, index) => ({
    id: `${lineId}-serial-${index + 1}`,
    line_id: lineId,
    tracking_type: 'Serial',
    serial_no: serial,
    qty_picked: 1,
    location_code: index % 2 === 0 ? 'BIN-A01' : 'BIN-A02',
    picked_by: index % 2 === 0 ? 'Nguyen Van A' : 'Tran Thi B',
    picked_at: `2024-03-1${index}T10:${20 + index}:00Z`
  }))

const createLotPickings = (
  lineId: string,
  lots: { lot_no: string; qty: number; received_date: string }[]
): GoodsIssuePickingRecord[] =>
  lots.map((lot, index) => ({
    id: `${lineId}-lot-${index + 1}`,
    line_id: lineId,
    tracking_type: 'Lot',
    lot_no: lot.lot_no,
    qty_picked: lot.qty,
    received_date: lot.received_date,
    location_code: index % 2 === 0 ? 'RACK-B01' : 'RACK-B02',
    picked_by: index % 2 === 0 ? 'Le Van C' : 'Pham Thi D',
    picked_at: `2024-03-15T0${index + 8}:30:00Z`
  }))

const laptopModel = findModel('MD_006')
const printerModel = findModel('MD_002')
const cableModel = findModel('MD_004')
const chairModel = findModel('MD_003')

const mainWarehouse = findWarehouse('WH01')
const branchWarehouse = findWarehouse('WH02')
const storageWarehouse = findWarehouse('WH03')

const partnerVNTech = findPartner('CUS001')
const partnerSupplier = findPartner('SUP001')

const pcsUom = findUom('PCS')
const kgUom = findUom('KG')

const linesForTransfer: GoodsIssueLine[] = [
  {
    id: 'gi-line-1',
    model_id: laptopModel?.id || '6',
    model_code: laptopModel?.model_code || 'MD_006',
    model_name: laptopModel?.model_name || 'Microsoft Surface Laptop 5',
    uom_id: pcsUom?.id || '1',
    uom_code: pcsUom?.uom_code || 'PCS',
    uom_name: pcsUom?.uom_name || 'Pieces',
    tracking_type: 'Serial',
    qty_planned: 10,
    qty_picked: 9,
    issue_method: 'Serial',
    difference: -1,
    status: 'Picking',
    pickings: createSerialPickings('gi-line-1', [
      'SN-20240315001',
      'SN-20240315002',
      'SN-20240315003',
      'SN-20240315004',
      'SN-20240315005',
      'SN-20240315006',
      'SN-20240315007',
      'SN-20240315008',
      'SN-20240315009'
    ])
  },
  {
    id: 'gi-line-2',
    model_id: cableModel?.id || '4',
    model_code: cableModel?.model_code || 'MD_004',
    model_name: cableModel?.model_name || 'Network Cable Cat6',
    uom_id: kgUom?.id || '6',
    uom_code: kgUom?.uom_code || 'KG',
    uom_name: kgUom?.uom_name || 'Kilogram',
    tracking_type: 'Lot',
    qty_planned: 50,
    qty_picked: 50,
    issue_method: 'Lot',
    difference: 0,
    status: 'Completed',
    pickings: createLotPickings('gi-line-2', [
      { lot_no: 'LOT-2308A', qty: 30, received_date: '2023-08-20T00:00:00Z' },
      { lot_no: 'LOT-2312B', qty: 20, received_date: '2023-12-05T00:00:00Z' }
    ])
  }
]

const linesForSales: GoodsIssueLine[] = [
  {
    id: 'gi-line-3',
    model_id: printerModel?.id || '2',
    model_code: printerModel?.model_code || 'MD_002',
    model_name: printerModel?.model_name || 'HP LaserJet Pro 404dn',
    uom_id: pcsUom?.id || '1',
    uom_code: pcsUom?.uom_code || 'PCS',
    uom_name: pcsUom?.uom_name || 'Pieces',
    tracking_type: 'Serial',
    qty_planned: 5,
    qty_picked: 5,
    issue_method: 'Serial',
    difference: 0,
    status: 'Completed',
    pickings: createSerialPickings('gi-line-3', [
      'SN-PR404-1001',
      'SN-PR404-1002',
      'SN-PR404-1003',
      'SN-PR404-1004',
      'SN-PR404-1005'
    ])
  },
  {
    id: 'gi-line-4',
    model_id: chairModel?.id || '3',
    model_code: chairModel?.model_code || 'MD_003',
    model_name: chairModel?.model_name || 'Office Chair Ergonomic',
    uom_id: pcsUom?.id || '1',
    uom_code: pcsUom?.uom_code || 'PCS',
    uom_name: pcsUom?.uom_name || 'Pieces',
    tracking_type: 'None',
    qty_planned: 20,
    qty_picked: 18,
    issue_method: 'Model',
    difference: -2,
    status: 'Shortage',
    pickings: [
      {
        id: 'gi-line-4-none-1',
        line_id: 'gi-line-4',
        tracking_type: 'None',
        qty_picked: 18,
        location_code: 'AISLE-C03',
        picked_by: 'Nguyen Van A',
        picked_at: '2024-03-12T09:45:00Z',
        note: '2 chairs with damaged armrests reported'
      }
    ]
  }
]

const transferHistories: GoodsIssueHistory[] = [
  {
    id: 'history-1',
    status: 'Draft',
    action: 'Draft created',
    actor: 'Le Thi Planning',
    timestamp: '2024-03-10T08:15:00Z'
  },
  {
    id: 'history-2',
    status: 'Picking',
    action: 'Picking started',
    actor: 'Nguyen Van A',
    timestamp: '2024-03-12T09:00:00Z',
    remark: 'Assigned to picking team'
  },
  {
    id: 'history-3',
    status: 'AdjustmentRequested',
    action: 'Adjustment requested',
    actor: 'Nguyen Van A',
    timestamp: '2024-03-12T10:20:00Z',
    remark: 'Missing 1 Surface Laptop due to QC hold'
  },
  {
    id: 'history-4',
    status: 'Submitted',
    action: 'Submitted for approval',
    actor: 'Tran Thi B',
    timestamp: '2024-03-12T11:00:00Z'
  }
]

const salesHistories: GoodsIssueHistory[] = [
  {
    id: 'history-5',
    status: 'Draft',
    action: 'Draft created',
    actor: 'Le Thi Planning',
    timestamp: '2024-03-05T07:30:00Z'
  },
  {
    id: 'history-6',
    status: 'Picking',
    action: 'Picking started',
    actor: 'Pham Thi D',
    timestamp: '2024-03-06T08:45:00Z'
  },
  {
    id: 'history-7',
    status: 'Submitted',
    action: 'Submitted for approval',
    actor: 'Pham Thi D',
    timestamp: '2024-03-06T10:15:00Z'
  },
  {
    id: 'history-8',
    status: 'Approved',
    action: 'Approved by warehouse manager',
    actor: 'Vo Quang Manager',
    timestamp: '2024-03-06T11:30:00Z'
  },
  {
    id: 'history-9',
    status: 'Completed',
    action: 'Inventory posted',
    actor: 'System',
    timestamp: '2024-03-06T12:00:00Z'
  }
]

export const mockGoodsIssues: GoodsIssue[] = [
  {
    id: 'GI-20240312-001',
    gi_no: 'GI-WH01-20240312-001',
    issue_type: 'Transfer',
    issue_method: 'Serial',
    from_wh_id: mainWarehouse?.id || '1',
    from_wh_code: mainWarehouse?.code || 'WH01',
    from_wh_name: mainWarehouse?.name || 'Main Warehouse',
    to_wh_id: branchWarehouse?.id,
    to_wh_code: branchWarehouse?.code,
    to_wh_name: branchWarehouse?.name,
    expected_date: '2024-03-13T00:00:00Z',
    remark: 'Transfer laptops to branch for onboarding batch 03/2024',
    status: 'Submitted',
    created_by: 'Le Thi Planning',
    created_at: '2024-03-10T08:15:00Z',
    submitted_by: 'Tran Thi B',
    submitted_at: '2024-03-12T11:00:00Z',
    lines: linesForTransfer,
    attachments: [
      {
        id: 'att-1',
        filename: 'packing-list.pdf',
        file_size: 245_000,
        file_type: 'application/pdf',
        uploaded_at: '2024-03-12T07:55:00Z',
        uploaded_by: 'Nguyen Van A'
      },
      {
        id: 'att-2',
        filename: 'handover-form.xlsx',
        file_size: 125_000,
        file_type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        uploaded_at: '2024-03-12T08:05:00Z',
        uploaded_by: 'Tran Thi B'
      }
    ],
    histories: transferHistories
  },
  {
    id: 'GI-20240306-002',
    gi_no: 'GI-WH01-20240306-002',
    issue_type: 'SO',
    issue_method: 'Serial',
    from_wh_id: mainWarehouse?.id || '1',
    from_wh_code: mainWarehouse?.code || 'WH01',
    from_wh_name: mainWarehouse?.name || 'Main Warehouse',
    partner_id: partnerVNTech?.id,
    partner_code: partnerVNTech?.partner_code,
    partner_name: partnerVNTech?.partner_name,
    expected_date: '2024-03-06T00:00:00Z',
    remark: 'Sales order SO-20240305-015 for VNTech',
    status: 'Completed',
    created_by: 'Le Thi Planning',
    created_at: '2024-03-05T07:30:00Z',
    submitted_by: 'Pham Thi D',
    submitted_at: '2024-03-06T10:15:00Z',
    approved_by: 'Vo Quang Manager',
    approved_at: '2024-03-06T11:30:00Z',
    completed_at: '2024-03-06T12:00:00Z',
    lines: linesForSales,
    attachments: [
      {
        id: 'att-3',
        filename: 'delivery-note.pdf',
        file_size: 310_000,
        file_type: 'application/pdf',
        uploaded_at: '2024-03-06T09:50:00Z',
        uploaded_by: 'Pham Thi D'
      }
    ],
    histories: salesHistories
  },
  {
    id: 'GI-20240308-003',
    gi_no: 'GI-WH03-20240308-003',
    issue_type: 'ReturnToSupplier',
    issue_method: 'Lot',
    from_wh_id: storageWarehouse?.id || '3',
    from_wh_code: storageWarehouse?.code || 'WH03',
    from_wh_name: storageWarehouse?.name || 'Storage Warehouse',
    partner_id: partnerSupplier?.id,
    partner_code: partnerSupplier?.partner_code,
    partner_name: partnerSupplier?.partner_name,
    expected_date: '2024-03-09T00:00:00Z',
    remark: 'Return defective batch LOT-2312B to supplier',
    status: 'Picking',
    created_by: 'Hoang Thi Logistics',
    created_at: '2024-03-07T13:20:00Z',
    lines: [linesForTransfer[1]],
    attachments: [],
    histories: [
      {
        id: 'history-10',
        status: 'Draft',
        action: 'Draft created',
        actor: 'Hoang Thi Logistics',
        timestamp: '2024-03-07T13:20:00Z'
      },
      {
        id: 'history-11',
        status: 'Picking',
        action: 'Picking in progress',
        actor: 'Le Van C',
        timestamp: '2024-03-08T08:45:00Z'
      }
    ]
  }
]

export const getGoodsIssueById = (id: string): GoodsIssue | undefined =>
  mockGoodsIssues.find(issue => issue.id === id)

export const getGoodsIssueSummaries = () =>
  mockGoodsIssues.map(issue => ({
    id: issue.id,
    gi_no: issue.gi_no,
    issue_type: issue.issue_type,
    status: issue.status,
    expected_date: issue.expected_date,
    from_wh_name: issue.from_wh_name,
    to_wh_name: issue.to_wh_name,
    partner_name: issue.partner_name,
    total_lines: issue.lines.length,
    total_qty_planned: issue.lines.reduce((acc, line) => acc + line.qty_planned, 0),
    total_qty_picked: issue.lines.reduce((acc, line) => acc + line.qty_picked, 0)
  }))
