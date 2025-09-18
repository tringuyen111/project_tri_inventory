import { FormEvent, useEffect, useMemo, useState } from 'react'
import { ArrowLeft, CalendarIcon, ClipboardList, Pencil, Plus, Trash2 } from 'lucide-react'

import { Button } from '../ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Input } from '../ui/input'
import { Label } from '../ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from '../ui/table'
import { Textarea } from '../ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockWarehouses } from '../../data/mockWarehouseData'
import { mockPartners } from '../../data/mockPartnerData'
import { GoodsIssue, GoodsIssueLine } from '../../types/goodsIssue'
import { toast } from 'sonner'
import { appendStoredGoodsIssue, AppendGoodsIssueResult } from '../../utils/goodsIssueStorage'

interface GoodsIssueFormState {
  issueNo: string
  issueType: GoodsIssue['issue_type']
  relatedEntry: string
  partnerId: string
  partnerAddress: string
  fromWarehouseId: string
  toWarehouseId: string
  expectedDate: string
  remarks: string
}

type TrackingType = 'None' | 'Serial' | 'Batch'

interface DraftLine {
  id: string
  sku: string
  productName: string
  uom: string
  plannedQty: number
  trackingType: TrackingType
  trackingNumber?: string
}

const translations = {
  en: {
    back: 'Back to Goods Issues',
    title: 'Create Goods Issue',
    description: 'Define fulfillment details, assign source warehouses, and capture picking quantities.',
    infoSection: 'Goods Issue Information',
    goodsIssueNo: 'Goods Issue No.',
    goodsIssueType: 'Goods Issue Type',
    relatedEntry: 'Related Entry',
    partner: 'Partner / Destination',
    partnerAddress: 'Address',
    fromWarehouse: 'Source Warehouse',
    toWarehouse: 'Destination Warehouse',
    expectedDate: 'Expected Issue Date',
    remarks: 'Remarks',
    status: 'Status',
    statusDraft: 'Draft',
    createdOn: 'Created On',
    createdBy: 'Created By',
    lineSection: 'Product Lines',
    addLine: 'Add Line',
    editLine: 'Edit Line',
    lineFormDescription: 'Specify the SKU, planned quantity and tracking data for this issue line.',
    lineProduct: 'Product Name',
    lineSku: 'SKU / Asset Code',
    lineUom: 'UoM',
    linePlannedQty: 'Planned Qty',
    lineTrackingType: 'Tracking Type',
    lineTrackingNumber: 'Tracking No.',
    trackingNone: 'None',
    trackingSerial: 'Serial',
    trackingBatch: 'Batch / Lot',
    cancel: 'Cancel',
    saveLine: 'Save Line',
    remove: 'Remove',
    noLines: 'No products added yet',
    tableSku: 'SKU',
    tableProduct: 'Product',
    tableTracking: 'Tracking',
    tablePlanned: 'Planned',
    tablePicked: 'Picked',
    tableDiff: 'Difference',
    tableUom: 'UoM',
    tableActions: 'Actions',
    summaryPlanned: 'Total Planned',
    summaryPicked: 'Total Picked',
    summaryDiff: 'Total Difference',
    createIssue: 'Create Goods Issue',
    formErrors: {
      partner: 'Please choose a partner or destination',
      fromWarehouse: 'Select a source warehouse',
      expectedDate: 'Expected date is required',
      issueType: 'Choose a goods issue type',
      lines: 'Add at least one line item before creating the goods issue'
    },
    toastSuccess: (issueNo: string) => `Goods issue ${issueNo} created`,
    toastStorageWarning:
      'Could not persist this goods issue locally. It will only be visible until you refresh the page.',
    dialogDeleteConfirm: 'Remove line'
  },
  vn: {
    back: 'Quay lại danh sách phiếu xuất',
    title: 'Tạo Phiếu Xuất Kho',
    description: 'Thiết lập thông tin xuất kho, chọn kho nguồn và ghi nhận số lượng soạn hàng.',
    infoSection: 'Thông tin phiếu xuất',
    goodsIssueNo: 'Số phiếu xuất',
    goodsIssueType: 'Loại phiếu xuất',
    relatedEntry: 'Chứng từ liên quan',
    partner: 'Đối tác / Điểm đến',
    partnerAddress: 'Địa chỉ',
    fromWarehouse: 'Kho xuất hàng',
    toWarehouse: 'Kho nhận (nếu có)',
    expectedDate: 'Ngày dự kiến xuất',
    remarks: 'Ghi chú',
    status: 'Trạng thái',
    statusDraft: 'Nháp',
    createdOn: 'Ngày tạo',
    createdBy: 'Người tạo',
    lineSection: 'Danh sách sản phẩm',
    addLine: 'Thêm dòng',
    editLine: 'Cập nhật dòng',
    lineFormDescription: 'Nhập SKU, số lượng kế hoạch và thông tin tracking cho dòng xuất kho.',
    lineProduct: 'Tên sản phẩm',
    lineSku: 'Mã SKU / Tài sản',
    lineUom: 'Đơn vị tính',
    linePlannedQty: 'Số lượng kế hoạch',
    lineTrackingType: 'Kiểu theo dõi',
    lineTrackingNumber: 'Mã theo dõi',
    trackingNone: 'Không theo dõi',
    trackingSerial: 'Serial',
    trackingBatch: 'Batch / Lot',
    cancel: 'Hủy',
    saveLine: 'Lưu dòng',
    remove: 'Xóa',
    noLines: 'Chưa có sản phẩm nào',
    tableSku: 'SKU',
    tableProduct: 'Sản phẩm',
    tableTracking: 'Theo dõi',
    tablePlanned: 'Kế hoạch',
    tablePicked: 'Đã soạn',
    tableDiff: 'Chênh lệch',
    tableUom: 'ĐVT',
    tableActions: 'Thao tác',
    summaryPlanned: 'Tổng kế hoạch',
    summaryPicked: 'Tổng đã soạn',
    summaryDiff: 'Tổng chênh lệch',
    createIssue: 'Tạo phiếu xuất kho',
    formErrors: {
      partner: 'Vui lòng chọn đối tác/điểm đến',
      fromWarehouse: 'Chọn kho xuất hàng',
      expectedDate: 'Vui lòng nhập ngày dự kiến',
      issueType: 'Chọn loại phiếu xuất',
      lines: 'Cần thêm ít nhất một dòng sản phẩm trước khi tạo phiếu'
    },
    toastSuccess: (issueNo: string) => `Đã tạo phiếu xuất ${issueNo}`,
    toastStorageWarning:
      'Không thể lưu phiếu xuất này trên trình duyệt. Phiếu chỉ hiển thị đến khi bạn tải lại trang.',
    dialogDeleteConfirm: 'Xóa dòng'
  }
}

const issueTypeOptions: Array<{
  value: GoodsIssue['issue_type']
  label: { en: string; vn: string }
}> = [
  { value: 'SO', label: { en: 'Sales Order Fulfillment', vn: 'Xuất theo đơn bán' } },
  { value: 'Transfer', label: { en: 'Warehouse Transfer', vn: 'Chuyển kho nội bộ' } },
  { value: 'ReturnToSupplier', label: { en: 'Return to Supplier', vn: 'Xuất trả nhà cung cấp' } },
  { value: 'Adjustment', label: { en: 'Inventory Adjustment', vn: 'Điều chỉnh tồn kho' } },
  { value: 'Manual', label: { en: 'Manual Issue', vn: 'Xuất thủ công' } }
]

const trackingTypeOptions: Array<{ value: TrackingType; label: { en: string; vn: string } }> = [
  { value: 'None', label: { en: translations.en.trackingNone, vn: translations.vn.trackingNone } },
  { value: 'Serial', label: { en: translations.en.trackingSerial, vn: translations.vn.trackingSerial } },
  { value: 'Batch', label: { en: translations.en.trackingBatch, vn: translations.vn.trackingBatch } }
]

const generateLineId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID()
  }
  return Math.random().toString(36).slice(2)
}

const generateIssueNumber = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = `${now.getMonth() + 1}`.padStart(2, '0')
  const day = `${now.getDate()}`.padStart(2, '0')
  const time = `${now.getHours()}`.padStart(2, '0')
  const minutes = `${now.getMinutes()}`.padStart(2, '0')
  const seconds = `${now.getSeconds()}`.padStart(2, '0')
  const milliseconds = `${now.getMilliseconds()}`.padStart(3, '0')
  const suffix = `${time}${minutes}${seconds}${milliseconds}`
  return `GI-${year}${month}${day}-${suffix}`
}

interface LineDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSave: (line: DraftLine) => void
  initialLine?: DraftLine | null
  language: keyof typeof translations
}

function LineDialog({ open, onOpenChange, onSave, initialLine, language }: LineDialogProps) {
  const t = translations[language]
  const [line, setLine] = useState<DraftLine>(() =>
    initialLine ?? {
      id: generateLineId(),
      productName: '',
      sku: '',
      uom: 'PCS',
      plannedQty: 1,
      trackingType: 'None',
      trackingNumber: ''
    }
  )

  useEffect(() => {
    if (initialLine) {
      setLine(initialLine)
    } else if (open) {
      setLine({
        id: generateLineId(),
        productName: '',
        sku: '',
        uom: 'PCS',
        plannedQty: 1,
        trackingType: 'None',
        trackingNumber: ''
      })
    }
  }, [initialLine, open])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!line.productName.trim() || !line.sku.trim() || !line.uom.trim() || line.plannedQty <= 0) {
      return
    }
    onSave({ ...line, plannedQty: Number(line.plannedQty) })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <DialogHeader>
            <DialogTitle>{initialLine ? t.editLine : t.addLine}</DialogTitle>
            <DialogDescription>{t.lineFormDescription}</DialogDescription>
          </DialogHeader>

          <div className="space-y-2">
            <Label htmlFor="line-product">{t.lineProduct}</Label>
            <Input
              id="line-product"
              value={line.productName}
              onChange={event => setLine(prev => ({ ...prev, productName: event.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="line-sku">{t.lineSku}</Label>
            <Input
              id="line-sku"
              value={line.sku}
              onChange={event => setLine(prev => ({ ...prev, sku: event.target.value }))}
              required
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="line-uom">{t.lineUom}</Label>
              <Input
                id="line-uom"
                value={line.uom}
                onChange={event => setLine(prev => ({ ...prev, uom: event.target.value }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line-planned">{t.linePlannedQty}</Label>
              <Input
                id="line-planned"
                type="number"
                min={1}
                value={line.plannedQty}
                onChange={event => setLine(prev => ({ ...prev, plannedQty: Number(event.target.value) }))}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="line-tracking-type">{t.lineTrackingType}</Label>
              <Select
                value={line.trackingType}
                onValueChange={value => setLine(prev => ({ ...prev, trackingType: value as TrackingType }))}
              >
                <SelectTrigger id="line-tracking-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {trackingTypeOptions.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label[language]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {line.trackingType !== 'None' && (
            <div className="space-y-2">
              <Label htmlFor="line-tracking-number">{t.lineTrackingNumber}</Label>
              <Input
                id="line-tracking-number"
                value={line.trackingNumber ?? ''}
                onChange={event => setLine(prev => ({ ...prev, trackingNumber: event.target.value }))}
              />
            </div>
          )}

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              {t.cancel}
            </Button>
            <Button type="submit">{t.saveLine}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export function GoodsIssueCreatePlaceholder() {
  const { language } = useLanguage()
  const selectedLanguage: keyof typeof translations = language in translations ? (language as keyof typeof translations) : 'en'
  const t = translations[selectedLanguage]

  const [formState, setFormState] = useState<GoodsIssueFormState>(() => ({
    issueNo: generateIssueNumber(),
    issueType: 'SO',
    relatedEntry: '',
    partnerId: '',
    partnerAddress: '',
    fromWarehouseId: '',
    toWarehouseId: '',
    expectedDate: '',
    remarks: ''
  }))
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof GoodsIssueFormState | 'lines', string>>>({})
  const [lines, setLines] = useState<DraftLine[]>([])
  const [lineDialogOpen, setLineDialogOpen] = useState(false)
  const [editingLine, setEditingLine] = useState<DraftLine | null>(null)

  const availablePartners = useMemo(() => mockPartners.filter(partner => partner.status === 'Active'), [])
  const availableWarehouses = useMemo(() => mockWarehouses.filter(warehouse => warehouse.isActive), [])

  const createdOn = useMemo(() => new Date(), [])
  const createdBy = 'current_user'

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-issue'
  }

  const resetLineDialog = () => {
    setEditingLine(null)
    setLineDialogOpen(true)
  }

  const handleSaveLine = (line: DraftLine) => {
    setLines(prevLines => {
      const existingIndex = prevLines.findIndex(item => item.id === line.id)
      if (existingIndex >= 0) {
        const updated = [...prevLines]
        updated[existingIndex] = line
        return updated
      }
      return [...prevLines, line]
    })
    setFormErrors(prev => ({ ...prev, lines: undefined }))
  }

  const handleEditLine = (lineId: string) => {
    const line = lines.find(item => item.id === lineId)
    if (line) {
      setEditingLine(line)
      setLineDialogOpen(true)
    }
  }

  const handleDeleteLine = (lineId: string) => {
    setLines(prevLines => prevLines.filter(line => line.id !== lineId))
  }

  const totals = useMemo(() => {
    return lines.reduce(
      (acc, line) => {
        acc.planned += line.plannedQty
        return acc
      },
      { planned: 0 }
    )
  }, [lines])

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    const errors: Partial<Record<keyof GoodsIssueFormState | 'lines', string>> = {}

    if (!formState.partnerId) {
      errors.partnerId = t.formErrors.partner
    }
    if (!formState.fromWarehouseId) {
      errors.fromWarehouseId = t.formErrors.fromWarehouse
    }
    if (!formState.expectedDate) {
      errors.expectedDate = t.formErrors.expectedDate
    }
    if (!formState.issueType) {
      errors.issueType = t.formErrors.issueType
    }
    if (!lines.length) {
      errors.lines = t.formErrors.lines
    }

    setFormErrors(errors)

    if (Object.keys(errors).length > 0) {
      return
    }

    const partner = availablePartners.find(item => item.id === formState.partnerId)
    const fromWarehouse = availableWarehouses.find(item => item.id === formState.fromWarehouseId)
    const toWarehouse = availableWarehouses.find(item => item.id === formState.toWarehouseId)

    const goodsIssueLines: GoodsIssueLine[] = lines.map((line, index) => ({
      line_id: `${index + 1}`,
      sku: line.sku,
      product_name: line.productName,
      planned_qty: line.plannedQty,
      picked_qty: 0,
      uom: line.uom
    }))

    const goodsIssue: GoodsIssue = {
      issue_no: formState.issueNo || generateIssueNumber(),
      issue_type: formState.issueType,
      status: 'Draft',
      partner_name: partner?.partner_name,
      from_wh_name: fromWarehouse?.name ?? '',
      to_wh_name: toWarehouse?.name,
      expected_date: formState.expectedDate,
      created_at: createdOn.toISOString(),
      created_by: createdBy,
      lines: goodsIssueLines
    }

    const appendResult: AppendGoodsIssueResult = appendStoredGoodsIssue(goodsIssue)
    if (appendResult === 'error' || appendResult === 'unavailable') {
      toast.warning(t.toastStorageWarning)
    } else if (appendResult === 'duplicate') {
      console.warn('Duplicate goods issue number detected while persisting locally', goodsIssue.issue_no)
    }
    window.dispatchEvent(new CustomEvent<GoodsIssue>('goods-issue-created', { detail: goodsIssue }))
    toast.success(t.toastSuccess(goodsIssue.issue_no))
    window.location.hash = '#warehouse/goods-issue'
  }

  useEffect(() => {
    if (!formState.partnerId) {
      setFormState(prev => ({ ...prev, partnerAddress: '' }))
      return
    }
    const partner = availablePartners.find(item => item.id === formState.partnerId)
    if (partner) {
      setFormState(prev => ({ ...prev, partnerAddress: partner.address }))
    }
  }, [formState.partnerId, availablePartners])

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={handleBack} className="inline-flex items-center gap-2">
        <ArrowLeft className="h-4 w-4" />
        {t.back}
      </Button>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle>{t.title}</CardTitle>
            <p className="text-sm text-muted-foreground">{t.description}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                {t.infoSection}
              </h3>
              <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="issue-no">{t.goodsIssueNo}</Label>
                  <Input id="issue-no" value={formState.issueNo} readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="issue-type">{t.goodsIssueType}</Label>
                  <Select
                    value={formState.issueType}
                    onValueChange={value => {
                      setFormState(prev => ({ ...prev, issueType: value as GoodsIssue['issue_type'] }))
                      setFormErrors(prev => ({ ...prev, issueType: undefined }))
                    }}
                  >
                    <SelectTrigger id="issue-type" className={formErrors.issueType ? 'ring-1 ring-destructive' : ''}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {issueTypeOptions.map(option => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label[selectedLanguage]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.issueType && <p className="text-sm text-destructive">{formErrors.issueType}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="related-entry">{t.relatedEntry}</Label>
                  <Input
                    id="related-entry"
                    value={formState.relatedEntry}
                    onChange={event => setFormState(prev => ({ ...prev, relatedEntry: event.target.value }))}
                    placeholder="SO-2024-001"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="partner">{t.partner}</Label>
                  <Select
                    value={formState.partnerId}
                    onValueChange={value => {
                      setFormState(prev => ({ ...prev, partnerId: value }))
                      setFormErrors(prev => ({ ...prev, partnerId: undefined }))
                    }}
                  >
                    <SelectTrigger id="partner" className={formErrors.partnerId ? 'ring-1 ring-destructive' : ''}>
                      <SelectValue placeholder={selectedLanguage === 'vn' ? 'Chọn đối tác' : 'Select partner'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availablePartners.map(partner => (
                        <SelectItem key={partner.id} value={partner.id}>
                          {partner.partner_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.partnerId && <p className="text-sm text-destructive">{formErrors.partnerId}</p>}
                </div>
                <div className="space-y-2 lg:col-span-2">
                  <Label htmlFor="partner-address">{t.partnerAddress}</Label>
                  <Input
                    id="partner-address"
                    value={formState.partnerAddress}
                    onChange={event => setFormState(prev => ({ ...prev, partnerAddress: event.target.value }))}
                    placeholder="123 Nguyen Van Linh, District 7"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="from-warehouse">{t.fromWarehouse}</Label>
                  <Select
                    value={formState.fromWarehouseId}
                    onValueChange={value => {
                      setFormState(prev => ({ ...prev, fromWarehouseId: value }))
                      setFormErrors(prev => ({ ...prev, fromWarehouseId: undefined }))
                    }}
                  >
                    <SelectTrigger id="from-warehouse" className={formErrors.fromWarehouseId ? 'ring-1 ring-destructive' : ''}>
                      <SelectValue placeholder={selectedLanguage === 'vn' ? 'Chọn kho' : 'Select warehouse'} />
                    </SelectTrigger>
                    <SelectContent>
                      {availableWarehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {formErrors.fromWarehouseId && <p className="text-sm text-destructive">{formErrors.fromWarehouseId}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="to-warehouse">{t.toWarehouse}</Label>
                  <Select
                    value={formState.toWarehouseId}
                    onValueChange={value => setFormState(prev => ({ ...prev, toWarehouseId: value }))}
                  >
                    <SelectTrigger id="to-warehouse">
                      <SelectValue placeholder="--" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">--</SelectItem>
                      {availableWarehouses.map(warehouse => (
                        <SelectItem key={warehouse.id} value={warehouse.id}>
                          {warehouse.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expected-date">{t.expectedDate}</Label>
                  <div className="relative">
                    <Input
                      id="expected-date"
                      type="date"
                      value={formState.expectedDate}
                      onChange={event => {
                        setFormState(prev => ({ ...prev, expectedDate: event.target.value }))
                        setFormErrors(prev => ({ ...prev, expectedDate: undefined }))
                      }}
                      className={formErrors.expectedDate ? 'ring-1 ring-destructive' : ''}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  </div>
                  {formErrors.expectedDate && <p className="text-sm text-destructive">{formErrors.expectedDate}</p>}
                </div>
                <div className="space-y-2">
                  <Label>{t.status}</Label>
                  <Input value={t.statusDraft} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>{t.createdOn}</Label>
                  <Input value={createdOn.toLocaleString()} readOnly />
                </div>
                <div className="space-y-2">
                  <Label>{t.createdBy}</Label>
                  <Input value={createdBy} readOnly />
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="remarks">{t.remarks}</Label>
              <Textarea
                id="remarks"
                value={formState.remarks}
                onChange={event => setFormState(prev => ({ ...prev, remarks: event.target.value }))}
                rows={4}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <CardTitle>{t.lineSection}</CardTitle>
              <p className="text-sm text-muted-foreground">
                {lines.length ? `${lines.length} ${selectedLanguage === 'vn' ? 'dòng sản phẩm' : 'line items'}` : t.noLines}
              </p>
            </div>
            <Button type="button" onClick={resetLineDialog} className="inline-flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t.addLine}
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[120px]">{t.tableSku}</TableHead>
                    <TableHead>{t.tableProduct}</TableHead>
                    <TableHead>{t.tableTracking}</TableHead>
                    <TableHead className="text-right">{t.tablePlanned}</TableHead>
                    <TableHead className="text-right">{t.tablePicked}</TableHead>
                    <TableHead className="text-right">{t.tableDiff}</TableHead>
                    <TableHead>{t.tableUom}</TableHead>
                    <TableHead className="w-[120px] text-right">{t.tableActions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lines.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="py-10 text-center text-muted-foreground">
                        <div className="flex flex-col items-center gap-3">
                          <ClipboardList className="h-10 w-10" />
                          <p>{t.noLines}</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    lines.map(line => (
                      <TableRow key={line.id}>
                        <TableCell className="font-medium">{line.sku}</TableCell>
                        <TableCell>{line.productName}</TableCell>
                        <TableCell>
                          {line.trackingType === 'None'
                            ? t.trackingNone
                            : `${line.trackingType === 'Serial' ? t.trackingSerial : t.trackingBatch}${line.trackingNumber ? ` • ${line.trackingNumber}` : ''}`}
                        </TableCell>
                        <TableCell className="text-right">{line.plannedQty.toLocaleString()}</TableCell>
                        <TableCell className="text-right">0</TableCell>
                        <TableCell className="text-right">{line.plannedQty.toLocaleString()}</TableCell>
                        <TableCell>{line.uom}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEditLine(line.id)}
                              aria-label={t.editLine}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteLine(line.id)}
                              aria-label={t.dialogDeleteConfirm}
                            >
                              <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {lines.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={3} className="text-right font-medium">
                        {t.summaryPlanned}
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {totals.planned.toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right font-semibold">0</TableCell>
                      <TableCell className="text-right font-semibold">
                        {totals.planned.toLocaleString()}
                      </TableCell>
                      <TableCell colSpan={2}>
                        <span className="text-sm text-muted-foreground">{t.summaryDiff}</span>
                      </TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
            {formErrors.lines && <p className="text-sm text-destructive">{formErrors.lines}</p>}
          </CardContent>
        </Card>

        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={handleBack}>
            {t.cancel}
          </Button>
          <Button type="submit">{t.createIssue}</Button>
        </div>
      </form>

      <LineDialog
        open={lineDialogOpen}
        onOpenChange={setLineDialogOpen}
        onSave={handleSaveLine}
        initialLine={editingLine}
        language={selectedLanguage}
      />
    </div>
  )
}
