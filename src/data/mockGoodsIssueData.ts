import { GoodsIssue, GoodsIssueAuditLog, GoodsIssueLine } from '../types/goodsIssue'
import { mockModelAssets } from './mockModelAssetData'
import { mockUoMs } from './mockUomData'
import { mockWarehouses } from './mockWarehouseData'
import { mockPartners } from './mockPartnerData'

export const mockGoodsIssueLines: GoodsIssueLine[] = [
  {
    id: 'gi-line-1',
    model_id: '1',
    model_code: 'MD_001',
    model_name: 'Dell OptiPlex 7090',
    uom_id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    tracking_type: 'Serial',
    qty_planned: 5,
    serial_numbers: ['SN-0001', 'SN-0002', 'SN-0003', 'SN-0004', 'SN-0005'],
    note: 'Demo serial tracked issue'
  },
  {
    id: 'gi-line-2',
    model_id: '3',
    model_code: 'MD_003',
    model_name: 'Office Chair Ergonomic',
    uom_id: '1',
    uom_code: 'PCS',
    uom_name: 'Pieces',
    tracking_type: 'None',
    qty_planned: 20
  },
  {
    id: 'gi-line-3',
    model_id: '4',
    model_code: 'MD_004',
    model_name: 'Network Cable Cat6',
    uom_id: '6',
    uom_code: 'KG',
    uom_name: 'Kilogram',
    tracking_type: 'Lot',
    qty_planned: 2,
    lot_no: 'LOT-2024-DEC',
    mfg_date: '2024-10-01',
    exp_date: '2026-10-01'
  }
]

export const mockGoodsIssues: GoodsIssue[] = [
  {
    id: 'gi-1',
    issue_no: 'GI-WH01-0001',
    issue_type: 'SO',
    ref_no: 'SO-2024-001',
    partner_id: '1',
    partner_code: 'CUST001',
    partner_name: 'Saigon Retail Group',
    from_wh_id: '1',
    from_wh_code: 'WH01',
    from_wh_name: 'Main Warehouse',
    planned_date: '2024-12-20',
    remark: 'Priority order for key customer',
    status: 'Draft',
    lines: [mockGoodsIssueLines[0], mockGoodsIssueLines[1]],
    created_at: '2024-12-10T09:00:00Z',
    created_by: 'inventory_staff',
    updated_at: '2024-12-10T09:00:00Z',
    updated_by: 'inventory_staff'
  },
  {
    id: 'gi-2',
    issue_no: 'GI-WH02-0001',
    issue_type: 'Transfer',
    ref_no: 'TR-2024-014',
    from_wh_id: '2',
    from_wh_code: 'WH02',
    from_wh_name: 'Branch Warehouse',
    to_wh_id: '1',
    to_wh_code: 'WH01',
    to_wh_name: 'Main Warehouse',
    planned_date: '2024-12-18',
    remark: 'Replenish central stock',
    status: 'Draft',
    lines: [mockGoodsIssueLines[2]],
    created_at: '2024-12-08T08:30:00Z',
    created_by: 'warehouse_manager',
    updated_at: '2024-12-08T08:30:00Z',
    updated_by: 'warehouse_manager'
  }
]

const goodsIssueSequences: Record<string, number> = {}

mockGoodsIssues.forEach(issue => {
  const whCode = issue.from_wh_code
  if (!goodsIssueSequences[whCode]) {
    goodsIssueSequences[whCode] = 0
  }
  const match = issue.issue_no.match(/GI-[^-]+-(\d+)/)
  if (match) {
    const seq = parseInt(match[1], 10)
    goodsIssueSequences[whCode] = Math.max(goodsIssueSequences[whCode], seq)
  }
})

export const mockGoodsIssueAuditLogs: GoodsIssueAuditLog[] = []

export function generateGoodsIssueNumber(warehouseCode: string) {
  const whCode = warehouseCode || 'WH01'
  goodsIssueSequences[whCode] = (goodsIssueSequences[whCode] || 0) + 1
  return `GI-${whCode}-${goodsIssueSequences[whCode].toString().padStart(4, '0')}`
}

export function logGoodsIssueAudit(action: GoodsIssueAuditLog['action'], issueId: string, details: string, metadata?: Record<string, unknown>) {
  const entry: GoodsIssueAuditLog = {
    id: `${Date.now()}`,
    issue_id: issueId,
    action,
    user_id: 'current_user',
    user_name: 'Current User',
    timestamp: new Date().toISOString(),
    details,
    metadata
  }

  mockGoodsIssueAuditLogs.push(entry)
  console.info('[Audit][GoodsIssue]', entry)
}

export function saveGoodsIssueDraft(draft: GoodsIssue) {
  const index = mockGoodsIssues.findIndex(issue => issue.id === draft.id)
  if (index >= 0) {
    mockGoodsIssues[index] = draft
  } else {
    mockGoodsIssues.push(draft)
  }

  logGoodsIssueAudit('updated', draft.id, 'Goods issue draft saved', {
    issue_no: draft.issue_no,
    status: draft.status,
    line_count: draft.lines.length
  })
}

export function resolveIssueHeaderData(issue: GoodsIssue) {
  const fromWarehouse = mockWarehouses.find(w => w.id === issue.from_wh_id)
  const toWarehouse = issue.to_wh_id ? mockWarehouses.find(w => w.id === issue.to_wh_id) : undefined
  const partner = issue.partner_id ? mockPartners.find(p => p.id === issue.partner_id) : undefined

  return {
    ...issue,
    from_wh_code: fromWarehouse?.code || issue.from_wh_code,
    from_wh_name: fromWarehouse?.name || issue.from_wh_name,
    to_wh_code: toWarehouse?.code || issue.to_wh_code,
    to_wh_name: toWarehouse?.name || issue.to_wh_name,
    partner_code: partner?.partner_code || issue.partner_code,
    partner_name: partner?.partner_name || issue.partner_name
  }
}

export function enrichGoodsIssueLine(line: GoodsIssueLine): GoodsIssueLine {
  const model = mockModelAssets.find(m => m.id === line.model_id)
  const uom = mockUoMs.find(u => u.id === line.uom_id)

  return {
    ...line,
    model_code: model?.model_code || line.model_code,
    model_name: model?.model_name || line.model_name,
    tracking_type: (model?.tracking_type as GoodsIssueLine['tracking_type']) || line.tracking_type,
    uom_code: uom?.uom_code || line.uom_code,
    uom_name: uom?.uom_name || line.uom_name
  }
}
