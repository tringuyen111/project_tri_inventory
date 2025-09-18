import { useMemo, useState } from 'react'

import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsIssue, GoodsIssueLine } from '../../types/goodsIssue'
import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'

const GOODS_ISSUE_STORAGE_KEY = 'tri:goods-issues'

type DraftLine = {
  lineId?: string
  sku: string
  productName: string
  plannedQty: number
  pickedQty: number
  uom: string
  trackingType?: 'None' | 'Lot' | 'Serial'
  trackingNumber?: string
}

type DraftIssue = {
  issueType: GoodsIssue['issue_type']
  status: GoodsIssue['status']
  partnerName?: string
  fromWarehouse: string
  toWarehouse?: string
  expectedDate: string
  createdBy: string
  lines: DraftLine[]
}

const translations = {
  en: {
    title: 'Goods Issue Creation (Preview)',
    description:
      'This preview simulates saving a goods issue so the management screen can be validated without a backend.',
    instructions:
      'Review the draft lines and create the preview issue. The record is stored in your browser so the table restores it after reload.',
    createIssue: 'Create Preview Issue',
    createdMessage: (issueNo: string) => `Preview issue ${issueNo} saved.`,
    lastCreated: 'Latest simulated issue',
    sku: 'SKU',
    product: 'Product',
    planned: 'Planned Qty',
    picked: 'Picked Qty',
    uom: 'UOM',
    trackingType: 'Tracking Type',
    trackingNumber: 'Tracking Number',
    none: 'None',
    lot: 'Lot',
    serial: 'Serial',
    emptyTrackingNumber: '—',
    persistNote: 'Stored issues keep their tracking metadata so it is visible after reloading the dashboard.'
  },
  vn: {
    title: 'Mô phỏng Tạo Phiếu Xuất Kho',
    description:
      'Trang xem trước này mô phỏng lưu một phiếu xuất kho để có thể kiểm thử màn quản lý khi chưa có backend.',
    instructions:
      'Xem lại các dòng dự thảo và tạo phiếu mô phỏng. Bản ghi sẽ được lưu trên trình duyệt để bảng quản lý khôi phục sau khi tải lại.',
    createIssue: 'Tạo Phiếu Mô Phỏng',
    createdMessage: (issueNo: string) => `Đã lưu phiếu mô phỏng ${issueNo}.`,
    lastCreated: 'Phiếu mô phỏng mới nhất',
    sku: 'Mã hàng',
    product: 'Sản phẩm',
    planned: 'SL kế hoạch',
    picked: 'SL đã soạn',
    uom: 'ĐVT',
    trackingType: 'Theo dõi',
    trackingNumber: 'Mã theo dõi',
    none: 'Không theo dõi',
    lot: 'Lô',
    serial: 'Serial',
    emptyTrackingNumber: '—',
    persistNote: 'Phiếu được lưu vẫn giữ nguyên thông tin theo dõi để xem lại sau khi tải lại màn hình.'
  }
} as const

const createDraftIssue = (): DraftIssue => ({
  issueType: 'Transfer',
  status: 'Draft',
  partnerName: 'Concept Store District 7',
  fromWarehouse: 'Central Fulfillment',
  toWarehouse: 'Concept Store D7',
  expectedDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10),
  createdBy: 'Automation Bot',
  lines: [
    {
      lineId: '1',
      sku: 'SKU-9005',
      productName: 'Handheld Scanner Model X',
      plannedQty: 5,
      pickedQty: 0,
      uom: 'each',
      trackingType: 'Serial',
      trackingNumber: 'SN-9005-0001'
    },
    {
      lineId: '2',
      sku: 'SKU-2110',
      productName: 'Retail Shelf Labels',
      plannedQty: 120,
      pickedQty: 0,
      uom: 'roll',
      trackingType: 'Lot',
      trackingNumber: 'LOT-2110-24A'
    },
    {
      lineId: '3',
      sku: 'SKU-3205',
      productName: 'Protective Packaging Filler',
      plannedQty: 18,
      pickedQty: 0,
      uom: 'bag',
      trackingType: 'None'
    }
  ]
})

const generateIssueNumber = () => {
  const timestamp = new Date().toISOString().replace(/[-:.TZ]/g, '')
  return `GI-${timestamp.slice(0, 12)}`
}

const mapDraftLinesToGoodsIssue = (draftLines: DraftLine[]): GoodsIssueLine[] => {
  return draftLines.map((line, index) => ({
    line_id: line.lineId || String(index + 1),
    sku: line.sku,
    product_name: line.productName,
    planned_qty: line.plannedQty,
    picked_qty: line.pickedQty,
    uom: line.uom,
    tracking_type: line.trackingType ?? 'None',
    tracking_number: line.trackingNumber
  }))
}

const buildGoodsIssueFromDraft = (draft: DraftIssue): GoodsIssue => {
  const goodsIssueLines = mapDraftLinesToGoodsIssue(draft.lines)

  return {
    issue_no: generateIssueNumber(),
    issue_type: draft.issueType,
    status: draft.status,
    partner_name: draft.partnerName,
    from_wh_name: draft.fromWarehouse,
    to_wh_name: draft.toWarehouse,
    expected_date: draft.expectedDate,
    created_at: new Date().toISOString(),
    created_by: draft.createdBy,
    lines: goodsIssueLines
  }
}

const getStoredGoodsIssues = (): GoodsIssue[] => {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const existingValue = window.localStorage.getItem(GOODS_ISSUE_STORAGE_KEY)
    if (!existingValue) {
      return []
    }

    const parsed = JSON.parse(existingValue) as unknown
    if (!Array.isArray(parsed)) {
      return []
    }

    return parsed.filter((issue): issue is GoodsIssue => {
      return (
        issue !== null &&
        typeof issue === 'object' &&
        typeof issue.issue_no === 'string' &&
        Array.isArray(issue.lines)
      )
    })
  } catch (error) {
    console.warn('Unable to read stored goods issues', error)
    return []
  }
}

const persistGoodsIssue = (issue: GoodsIssue) => {
  if (typeof window === 'undefined') {
    return
  }

  const stored = getStoredGoodsIssues()
  const withoutCurrent = stored.filter(existing => existing.issue_no !== issue.issue_no)
  const updated = [issue, ...withoutCurrent]

  try {
    window.localStorage.setItem(GOODS_ISSUE_STORAGE_KEY, JSON.stringify(updated))
  } catch (error) {
    console.warn('Unable to store goods issues', error)
  }
}

export function GoodsIssueCreatePlaceholder() {
  const { language } = useLanguage()
  const [draft] = useState<DraftIssue>(() => createDraftIssue())
  const [lastCreatedIssue, setLastCreatedIssue] = useState<GoodsIssue | null>(null)

  const selectedLanguage: keyof typeof translations = useMemo(() => {
    return language in translations ? (language as keyof typeof translations) : 'en'
  }, [language])

  const t = translations[selectedLanguage]

  const goodsIssueLines = useMemo(() => mapDraftLinesToGoodsIssue(draft.lines), [draft.lines])

  const handleCreateIssue = () => {
    const goodsIssue = buildGoodsIssueFromDraft(draft)
    persistGoodsIssue(goodsIssue)
    window.dispatchEvent(
      new CustomEvent<GoodsIssue>('goods-issue-created', {
        detail: goodsIssue
      })
    )
    setLastCreatedIssue(goodsIssue)
  }

  const trackingLabel = (trackingType: GoodsIssueLine['tracking_type']) => {
    switch (trackingType) {
      case 'Serial':
        return t.serial
      case 'Lot':
        return t.lot
      case 'None':
      default:
        return t.none
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="space-y-2">
          <CardTitle className="text-2xl font-semibold">{t.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          <p className="text-sm text-muted-foreground">{t.instructions}</p>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.sku}</TableHead>
                  <TableHead>{t.product}</TableHead>
                  <TableHead className="text-right">{t.planned}</TableHead>
                  <TableHead className="text-right">{t.picked}</TableHead>
                  <TableHead>{t.uom}</TableHead>
                  <TableHead>{t.trackingType}</TableHead>
                  <TableHead>{t.trackingNumber}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {goodsIssueLines.map(line => (
                  <TableRow key={line.line_id}>
                    <TableCell>{line.sku}</TableCell>
                    <TableCell>{line.product_name}</TableCell>
                    <TableCell className="text-right">{line.planned_qty.toLocaleString()}</TableCell>
                    <TableCell className="text-right">{line.picked_qty.toLocaleString()}</TableCell>
                    <TableCell>{line.uom}</TableCell>
                    <TableCell>{trackingLabel(line.tracking_type)}</TableCell>
                    <TableCell>{line.tracking_number || t.emptyTrackingNumber}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <Button onClick={handleCreateIssue}>{t.createIssue}</Button>
          <p className="text-xs text-muted-foreground">{t.persistNote}</p>
        </CardContent>
      </Card>

      {lastCreatedIssue && (
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">{t.lastCreated}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p className="text-sm font-medium">{t.createdMessage(lastCreatedIssue.issue_no)}</p>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.sku}</TableHead>
                    <TableHead>{t.product}</TableHead>
                    <TableHead className="text-right">{t.planned}</TableHead>
                    <TableHead className="text-right">{t.picked}</TableHead>
                    <TableHead>{t.uom}</TableHead>
                    <TableHead>{t.trackingType}</TableHead>
                    <TableHead>{t.trackingNumber}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lastCreatedIssue.lines.map(line => (
                    <TableRow key={`${lastCreatedIssue.issue_no}-${line.line_id}`}>
                      <TableCell>{line.sku}</TableCell>
                      <TableCell>{line.product_name}</TableCell>
                      <TableCell className="text-right">{line.planned_qty.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{line.picked_qty.toLocaleString()}</TableCell>
                      <TableCell>{line.uom}</TableCell>
                      <TableCell>{trackingLabel(line.tracking_type)}</TableCell>
                      <TableCell>{line.tracking_number || t.emptyTrackingNumber}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
