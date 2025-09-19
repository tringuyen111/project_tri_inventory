import { useMemo, useState, type ReactNode } from 'react'
import {
  BadgeCheck,
  Boxes,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardSignature,
  Columns3,
  Download,
  FileSpreadsheet,
  Filter,
  ListChecks,
  NotebookPen,
  Plus,
  RefreshCw,
  Search,
  Send,
  ShieldCheck,
  TriangleAlert,
  XCircle
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { DropdownMenu, DropdownMenuCheckboxItem, DropdownMenuContent, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { Checkbox } from '../ui/checkbox'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Alert, AlertDescription, AlertTitle } from '../ui/alert'
import { toast } from 'sonner'

import { mockInventoryCounts } from '../../data/mockInventoryCountData'
import {
  InventoryCount,
  InventoryCountAuditEntry,
  InventoryCountLine,
  InventoryCountStatus,
  InventoryCountTrackingType
} from '../../types/inventoryCount'
import { useLanguage } from '../../contexts/LanguageContext'

const translations = {
  en: {
    title: 'Inventory Count',
    description: 'Plan, execute and audit stock counts with blind mode and full traceability.',
    searchPlaceholder: 'Search count ID, warehouse, model or note...',
    statusFilter: 'Status',
    warehouseFilter: 'Warehouse',
    scopeFilter: 'Scope',
    blindFilter: 'Blind mode',
    allStatuses: 'All statuses',
    allWarehouses: 'All warehouses',
    allScopes: 'All scopes',
    blindAll: 'All',
    blindYes: 'Yes',
    blindNo: 'No',
    create: 'Create Count',
    export: 'Export Excel',
    columns: 'Columns',
    clearFilters: 'Clear filters',
    zeroProgress: 'Zero progress',
    snapshotAt: 'Snapshot at',
    createdBy: 'Created by',
    submittedBy: 'Submitted by',
    completedBy: 'Completed by',
    blindMode: 'Blind mode',
    scopeType: 'Scope type',
    locationScope: 'Locations',
    modelScope: 'Models',
    note: 'Note',
    zeroRequired: 'Zero-by-location requirement',
    zeroComplete: 'Locations zeroed',
    lines: 'Count lines',
    detailTracking: 'Detail tracking',
    auditTrail: 'Audit trail',
    noResults: 'No counts match the applied filters.',
    manualEntryHint: 'Manual entry or SKU scan required for non-tracked items.',
    businessRules: 'Business rules',
    detailDialogTitle: 'Inventory Count Detail',
    detailDialogDescription: 'Review count scope, captured quantities and audit trail before approval.',
    actionSubmit: 'Submit for Review',
    actionComplete: 'Complete',
    actionExportVariance: 'Export Variance',
    actionReopen: 'Reopen',
    actionResume: 'Resume Counting',
    actionAcknowledge: 'Acknowledge',
    blindModeActive: 'Blind mode enabled. System quantity and variance are hidden for counters.',
    blindModeInactive: 'Blind mode disabled. System quantity and variance visible to reviewers.',
    statusDraft: 'Draft',
    statusCounting: 'Counting',
    statusSubmitted: 'Submitted',
    statusCompleted: 'Completed',
    statusCancelled: 'Cancelled',
    trackingSerial: 'Serial',
    trackingLot: 'Lot',
    trackingNone: 'None',
    countedQty: 'Counted qty',
    systemQty: 'System qty',
    diffQty: 'Variance',
    zeroed: 'Zeroed',
    unlisted: 'Unlisted',
    remark: 'Remark',
    countedBy: 'Scanned by',
    countedAt: 'Scanned at',
    detailId: 'Detail ID',
    location: 'Location',
    model: 'Model',
    tracking: 'Tracking',
    uom: 'UoM',
    actions: 'Actions',
    show: 'Show',
    entries: 'entries',
    showing: 'Showing',
    of: 'of',
    perPage: 'per page',
    doubleClickHint: 'Double-click a row to open the detailed count review.',
    createScopeTitle: 'Preload scope for new count',
    createScopeDescription: 'Select the warehouse and scope to auto-generate count lines and freeze stock snapshot.',
    formWarehouse: 'Warehouse',
    formScope: 'Scope type',
    formBlind: 'Enable blind mode',
    formPreview: 'Scope preview',
    locations: 'Locations',
    models: 'Models',
    cancel: 'Cancel',
    continue: 'Create and open count',
    createSuccess: (id: string) => `Inventory count ${id} created with frozen snapshot.`,
    zeroIncompleteWarning: 'Zero-by-location must be completed before submission.',
    zeroCompleteAll: 'All scoped locations zeroed.',
    auditRequirement: 'Full audit trail maintained. Review events below.',
    ruleSnapshot: 'Snapshot captured at creation.',
    ruleBlind: 'Blind mode hides system quantity and variance for counters.',
    ruleSerial: 'Serial numbers must be unique within the count.',
    ruleLot: 'Lots are validated per model/location and aggregated.',
    ruleNone: 'None tracking relies on manual entry or SKU scan.',
    ruleZero: 'Zero-by-location required before submit.',
    ruleVariance: 'Completion generates variance report without updating stock.',
    ruleAudit: 'Audit log is immutable for compliance.',
    duplicateSerialDetected: 'Duplicate serial detected',
    duplicateSerialClear: 'No duplicate serials detected',
    lotMismatchDetected: 'Lot mismatch detected',
    lotValidationClear: 'Lots validated against model/location scope'
  },
  vi: {
    title: 'Kiểm đếm tồn kho',
    description: 'Lập kế hoạch, thực hiện và kiểm toán kiểm kê với chế độ mù và truy vết đầy đủ.',
    searchPlaceholder: 'Tìm kiếm mã kiểm kê, kho, model hoặc ghi chú...',
    statusFilter: 'Trạng thái',
    warehouseFilter: 'Kho',
    scopeFilter: 'Phạm vi',
    blindFilter: 'Chế độ mù',
    allStatuses: 'Tất cả trạng thái',
    allWarehouses: 'Tất cả kho',
    allScopes: 'Tất cả phạm vi',
    blindAll: 'Tất cả',
    blindYes: 'Có',
    blindNo: 'Không',
    create: 'Tạo kiểm kê',
    export: 'Xuất Excel',
    columns: 'Cột',
    clearFilters: 'Xóa bộ lọc',
    zeroProgress: 'Tiến độ zero',
    snapshotAt: 'Chụp snapshot lúc',
    createdBy: 'Tạo bởi',
    submittedBy: 'Gửi bởi',
    completedBy: 'Hoàn tất bởi',
    blindMode: 'Chế độ mù',
    scopeType: 'Loại phạm vi',
    locationScope: 'Khu vực',
    modelScope: 'Model',
    note: 'Ghi chú',
    zeroRequired: 'Yêu cầu zero theo vị trí',
    zeroComplete: 'Vị trí đã zero',
    lines: 'Dòng kiểm kê',
    detailTracking: 'Chi tiết quét',
    auditTrail: 'Lịch sử kiểm toán',
    noResults: 'Không có kiểm kê nào phù hợp bộ lọc.',
    manualEntryHint: 'Cần nhập tay hoặc quét SKU cho mặt hàng không theo dõi.',
    businessRules: 'Quy tắc nghiệp vụ',
    detailDialogTitle: 'Chi tiết kiểm kê',
    detailDialogDescription: 'Xem phạm vi, số liệu và lịch sử trước khi phê duyệt.',
    actionSubmit: 'Gửi phê duyệt',
    actionComplete: 'Hoàn tất',
    actionExportVariance: 'Xuất chênh lệch',
    actionReopen: 'Mở lại',
    actionResume: 'Tiếp tục kiểm đếm',
    actionAcknowledge: 'Xác nhận',
    blindModeActive: 'Đang bật chế độ mù. Số hệ thống và chênh lệch bị ẩn với nhân viên đếm.',
    blindModeInactive: 'Không bật chế độ mù. Số hệ thống và chênh lệch hiển thị cho người duyệt.',
    statusDraft: 'Nháp',
    statusCounting: 'Đang đếm',
    statusSubmitted: 'Đã gửi',
    statusCompleted: 'Hoàn tất',
    statusCancelled: 'Đã hủy',
    trackingSerial: 'Serial',
    trackingLot: 'Lot',
    trackingNone: 'Không',
    countedQty: 'SL kiểm đếm',
    systemQty: 'SL hệ thống',
    diffQty: 'Chênh lệch',
    zeroed: 'Zero',
    unlisted: 'Ngoài phạm vi',
    remark: 'Ghi chú',
    countedBy: 'Quét bởi',
    countedAt: 'Thời gian',
    detailId: 'Mã chi tiết',
    location: 'Vị trí',
    model: 'Model',
    tracking: 'Theo dõi',
    uom: 'ĐVT',
    actions: 'Thao tác',
    show: 'Hiển thị',
    entries: 'dòng',
    showing: 'Đang xem',
    of: 'trên',
    perPage: 'mỗi trang',
    doubleClickHint: 'Nhấp đúp vào dòng để mở chi tiết kiểm kê.',
    createScopeTitle: 'Nạp phạm vi cho kiểm kê mới',
    createScopeDescription: 'Chọn kho và phạm vi để tự tạo dòng kiểm kê và đóng băng số liệu.',
    formWarehouse: 'Kho',
    formScope: 'Loại phạm vi',
    formBlind: 'Bật chế độ mù',
    formPreview: 'Xem trước phạm vi',
    locations: 'Khu vực',
    models: 'Model',
    cancel: 'Hủy',
    continue: 'Tạo và mở kiểm kê',
    createSuccess: (id: string) => `Đã tạo kiểm kê ${id} với snapshot đóng băng.`,
    zeroIncompleteWarning: 'Phải zero theo vị trí trước khi gửi.',
    zeroCompleteAll: 'Đã zero tất cả vị trí.',
    auditRequirement: 'Bắt buộc lưu vết đầy đủ. Xem sự kiện bên dưới.',
    ruleSnapshot: 'Đã chụp snapshot khi tạo.',
    ruleBlind: 'Chế độ mù ẩn số hệ thống và chênh lệch cho nhân viên.',
    ruleSerial: 'Số serial không được trùng trong cùng kiểm kê.',
    ruleLot: 'Lot được kiểm tra theo model/vị trí và cộng gộp.',
    ruleNone: 'Theo dõi None cần nhập tay hoặc quét SKU.',
    ruleZero: 'Phải zero theo vị trí trước khi gửi.',
    ruleVariance: 'Hoàn tất chỉ tạo báo cáo chênh lệch, không cập nhật tồn.',
    ruleAudit: 'Nhật ký kiểm toán không thể chỉnh sửa.',
    duplicateSerialDetected: 'Phát hiện trùng serial',
    duplicateSerialClear: 'Không phát hiện trùng serial',
    lotMismatchDetected: 'Phát hiện lot không hợp lệ',
    lotValidationClear: 'Lot khớp với phạm vi model/vị trí'
  }
}

const statusBadgeStyles: Record<InventoryCountStatus, string> = {
  Draft: 'bg-gray-200 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
  Counting: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

interface ColumnConfig {
  id: string
  label: string
  alwaysOn?: boolean
  render: (count: InventoryCount, t: typeof translations['en']) => ReactNode
  className?: string
}

const trackingVariant: Record<InventoryCountTrackingType, string> = {
  Serial: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  Lot: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  None: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200'
}

const formatDateTime = (value?: string) => {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) {
    return value
  }
  return date.toLocaleString()
}

const generateCountId = (warehouseId: string, existingCounts: InventoryCount[]) => {
  const sequence = existingCounts
    .filter((count) => count.wh_id === warehouseId)
    .length + 1
  return `IC-${warehouseId}-${sequence.toString().padStart(3, '0')}`
}

const getZeroProgress = (count: InventoryCount) => {
  const required = count.zero_required_locations.length
  if (!required) return '0 / 0'
  return `${count.zero_completed_locations.length} / ${required}`
}

interface DetailDialogProps {
  open: boolean
  count: InventoryCount | null
  onOpenChange: (open: boolean) => void
  t: typeof translations['en']
}

function InventoryCountDetailDialog({ open, count, onOpenChange, t }: DetailDialogProps) {
  if (!count) return null

  const blindModeMessage = count.blind_mode ? t.blindModeActive : t.blindModeInactive
  const serialNumbers = count.details.map((detail) => detail.serial_no).filter((serial): serial is string => Boolean(serial))
  const hasDuplicateSerials = new Set(serialNumbers).size !== serialNumbers.length

  const lotMismatch = count.details.some((detail) => {
    if (!detail.lot_no) return false
    const relatedLine = count.lines.find((line) => line.line_id === detail.line_id)
    return !relatedLine || relatedLine.location_id !== detail.location_id || relatedLine.model_id === ''
  })

  const zeroComplete =
    count.zero_required_locations.length > 0 &&
    count.zero_required_locations.every((loc) => count.zero_completed_locations.includes(loc))

  const ruleItems: Array<{ id: string; icon: React.ReactNode; text: string; variant: 'default' | 'warning' } > = [
    { id: 'snapshot', icon: <ShieldCheck className="h-4 w-4" />, text: t.ruleSnapshot, variant: 'default' },
    { id: 'blind', icon: <ListChecks className="h-4 w-4" />, text: t.ruleBlind, variant: 'default' },
    {
      id: 'serial',
      icon: hasDuplicateSerials ? <TriangleAlert className="h-4 w-4 text-red-500" /> : <CheckCircle2 className="h-4 w-4" />,
      text: hasDuplicateSerials ? t.duplicateSerialDetected : t.ruleSerial,
      variant: hasDuplicateSerials ? 'warning' : 'default'
    },
    {
      id: 'lot',
      icon: lotMismatch ? <TriangleAlert className="h-4 w-4 text-red-500" /> : <Boxes className="h-4 w-4" />,
      text: lotMismatch ? t.lotMismatchDetected : t.ruleLot,
      variant: lotMismatch ? 'warning' : 'default'
    },
    { id: 'none', icon: <NotebookPen className="h-4 w-4" />, text: t.ruleNone, variant: 'default' },
    {
      id: 'zero',
      icon: zeroComplete ? <CheckCircle2 className="h-4 w-4" /> : <TriangleAlert className="h-4 w-4 text-amber-500" />,
      text: zeroComplete ? t.zeroCompleteAll : t.ruleZero,
      variant: zeroComplete ? 'default' : 'warning'
    },
    { id: 'variance', icon: <ClipboardSignature className="h-4 w-4" />, text: t.ruleVariance, variant: 'default' },
    { id: 'audit', icon: <BadgeCheck className="h-4 w-4" />, text: t.ruleAudit, variant: 'default' }
  ]

  const canExportVariance = count.status === 'Completed' && Boolean(count.variance_report_url)
  const canSubmit = count.status === 'Draft' || count.status === 'Counting'
  const canComplete = count.status === 'Submitted'
  const canResume = count.status === 'Counting'
  const canReopen = count.status === 'Submitted' || count.status === 'Completed'

  const handleExportVariance = () => {
    if (!canExportVariance || !count.variance_report_url) return
    window.open(count.variance_report_url, '_blank')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl gap-6">
        <DialogHeader className="space-y-2">
          <DialogTitle className="flex flex-wrap items-center gap-3">
            {t.detailDialogTitle}
            <Badge className={statusBadgeStyles[count.status]}>{t[`status${count.status}` as const]}</Badge>
            <span className="text-sm text-muted-foreground">{count.count_id}</span>
          </DialogTitle>
          <DialogDescription>{t.detailDialogDescription}</DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh] pr-4">
          <div className="space-y-6">
            <div className="flex flex-wrap gap-2">
              <Button size="sm" variant="secondary" disabled={!canSubmit}>
                <Send className="mr-2 h-4 w-4" />
                {t.actionSubmit}
              </Button>
              <Button size="sm" variant="secondary" disabled={!canComplete}>
                <CheckCircle2 className="mr-2 h-4 w-4" />
                {t.actionComplete}
              </Button>
              <Button size="sm" variant="secondary" disabled={!canResume}>
                <RefreshCw className="mr-2 h-4 w-4" />
                {t.actionResume}
              </Button>
              <Button size="sm" variant="secondary" disabled={!canReopen}>
                <XCircle className="mr-2 h-4 w-4" />
                {t.actionReopen}
              </Button>
              <Button size="sm" onClick={handleExportVariance} disabled={!canExportVariance}>
                <FileSpreadsheet className="mr-2 h-4 w-4" />
                {t.actionExportVariance}
              </Button>
              <Button size="sm" variant="outline">
                <Download className="mr-2 h-4 w-4" />
                {t.actionAcknowledge}
              </Button>
            </div>

            <Alert>
              <ShieldCheck className="h-4 w-4" />
              <AlertTitle>{t.auditRequirement}</AlertTitle>
              <AlertDescription>{blindModeMessage}</AlertDescription>
            </Alert>

            <div className="grid gap-4 md:grid-cols-2">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.scopeType}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.scopeType}</span>
                    <span>{count.scope_type}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.warehouseFilter}</span>
                    <span>{count.wh_name} ({count.wh_id})</span>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">{t.locationScope}</span>
                    <div className="flex flex-wrap gap-2">
                      {count.location_list.map((location) => (
                        <Badge key={location.id} variant="outline">{location.name}</Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <span className="text-muted-foreground">{t.modelScope}</span>
                    <div className="flex flex-wrap gap-2">
                      {count.model_list.map((model) => (
                        <Badge
                          key={model.id}
                          className={`${trackingVariant[model.tracking_type]} border-transparent`}
                        >
                          {model.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Badge className={count.blind_mode ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'}>
                      {count.blind_mode ? t.blindYes : t.blindNo}
                    </Badge>
                    <span>{t.blindMode}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.snapshotAt}</span>
                    <span>{formatDateTime(count.snapshot_at)}</span>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">{t.note}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.createdBy}</span>
                    <span>{count.created_by} • {formatDateTime(count.created_at)}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.submittedBy}</span>
                    <span>{count.submitted_by ? `${count.submitted_by} • ${formatDateTime(count.submitted_at)}` : '—'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.completedBy}</span>
                    <span>{count.completed_by ? `${count.completed_by} • ${formatDateTime(count.completed_at)}` : '—'}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.zeroRequired}</span>
                    <span>{count.zero_required_locations.length}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-muted-foreground">{t.zeroComplete}</span>
                    <span>{getZeroProgress(count)}</span>
                  </div>
                  <Alert className="bg-muted">
                    <NotebookPen className="h-4 w-4" />
                    <AlertTitle>{t.note}</AlertTitle>
                    <AlertDescription>{count.note || '—'}</AlertDescription>
                  </Alert>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.lines}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.model}</TableHead>
                      <TableHead>{t.location}</TableHead>
                      <TableHead>{t.tracking}</TableHead>
                      {!count.blind_mode && <TableHead className="text-right">{t.systemQty}</TableHead>}
                      <TableHead className="text-right">{t.countedQty}</TableHead>
                      {!count.blind_mode && <TableHead className="text-right">{t.diffQty}</TableHead>}
                      <TableHead className="text-center">{t.zeroed}</TableHead>
                      <TableHead className="text-center">{t.unlisted}</TableHead>
                      <TableHead>{t.remark}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {count.lines.map((line) => {
                      const diff = line.counted_qty === null ? null : (line.counted_qty ?? 0) - line.system_qty
                      const varianceClass = diff === null
                        ? ''
                        : diff === 0
                          ? 'text-muted-foreground'
                          : diff > 0
                            ? 'text-emerald-600 dark:text-emerald-300'
                            : 'text-red-600 dark:text-red-300'
                      return (
                        <TableRow key={line.line_id}>
                          <TableCell className="min-w-[160px]">
                            <div className="flex flex-col">
                              <span className="font-medium">{line.model_name}</span>
                              <span className="text-xs text-muted-foreground">{line.model_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{line.location_name}</span>
                              <span className="text-xs text-muted-foreground">{line.location_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={`${trackingVariant[line.tracking_type]} border-transparent`}>
                              {t[`tracking${line.tracking_type}` as const]}
                            </Badge>
                          </TableCell>
                          {!count.blind_mode && (
                            <TableCell className="text-right font-mono">{line.system_qty.toLocaleString()}</TableCell>
                          )}
                          <TableCell className="text-right font-mono">
                            {line.counted_qty === null ? '—' : line.counted_qty.toLocaleString()}
                          </TableCell>
                          {!count.blind_mode && (
                            <TableCell className={`text-right font-mono ${varianceClass}`}>
                              {diff === null ? '—' : diff.toLocaleString()}
                            </TableCell>
                          )}
                          <TableCell className="text-center">
                            {line.is_zeroed ? <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" /> : <TriangleAlert className="mx-auto h-4 w-4 text-amber-500" />}
                          </TableCell>
                          <TableCell className="text-center">
                            {line.is_unlisted ? <TriangleAlert className="mx-auto h-4 w-4 text-red-500" /> : <ShieldCheck className="mx-auto h-4 w-4 text-muted-foreground" />}
                          </TableCell>
                          <TableCell className="max-w-[240px] text-xs text-muted-foreground">
                            {line.remark || '—'}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.detailTracking}</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.detailId}</TableHead>
                      <TableHead>{t.model}</TableHead>
                      <TableHead>{t.tracking}</TableHead>
                      <TableHead className="text-right">{t.countedQty}</TableHead>
                      <TableHead>{t.location}</TableHead>
                      <TableHead>{t.countedBy}</TableHead>
                      <TableHead>{t.countedAt}</TableHead>
                      <TableHead className="text-center">{t.unlisted}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {count.details.map((detail) => {
                      const relatedLine = count.lines.find((line) => line.line_id === detail.line_id)
                      return (
                        <TableRow key={detail.detail_id}>
                          <TableCell>
                            <div className="flex flex-col">
                              <span className="font-medium">{detail.detail_id}</span>
                              {detail.serial_no && <span className="text-xs text-muted-foreground">{detail.serial_no}</span>}
                              {detail.lot_no && <span className="text-xs text-muted-foreground">{detail.lot_no}</span>}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{relatedLine?.model_name ?? '—'}</span>
                              <span className="text-xs text-muted-foreground">{relatedLine?.model_id ?? '—'}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {relatedLine ? (
                              <Badge className={`${trackingVariant[relatedLine.tracking_type]} border-transparent`}>
                                {t[`tracking${relatedLine.tracking_type}` as const]}
                              </Badge>
                            ) : '—'}
                          </TableCell>
                          <TableCell className="text-right font-mono">{detail.qty.toLocaleString()}</TableCell>
                          <TableCell>
                            <div className="flex flex-col">
                              <span>{detail.location_name}</span>
                              <span className="text-xs text-muted-foreground">{detail.location_id}</span>
                            </div>
                          </TableCell>
                          <TableCell>{detail.scanned_by}</TableCell>
                          <TableCell>{formatDateTime(detail.scanned_at)}</TableCell>
                          <TableCell className="text-center">
                            {detail.is_unlisted ? <TriangleAlert className="mx-auto h-4 w-4 text-red-500" /> : <CheckCircle2 className="mx-auto h-4 w-4 text-emerald-500" />}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.auditTrail}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <ul className="space-y-3">
                  {count.audit_trail.map((entry: InventoryCountAuditEntry) => (
                    <li key={entry.id} className="flex flex-col gap-1 rounded-md border p-3">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline">{formatDateTime(entry.timestamp)}</Badge>
                        <span className="font-medium">{entry.actor}</span>
                        <span className="text-muted-foreground">{entry.role}</span>
                      </div>
                      <div className="font-medium">{entry.action}</div>
                      {entry.note && <div className="text-muted-foreground">{entry.note}</div>}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t.businessRules}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-2">
                  {ruleItems.map((item) => (
                    <div
                      key={item.id}
                      className={`flex items-start gap-3 rounded-md border p-3 text-sm ${
                        item.variant === 'warning' ? 'border-amber-500/50 bg-amber-50 dark:bg-amber-500/10' : 'bg-muted'
                      }`}
                    >
                      {item.icon}
                      <span>{item.text}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}

export function InventoryCountManagement() {
  const { language } = useLanguage()
  const t = translations[language]

  const [counts, setCounts] = useState<InventoryCount[]>(mockInventoryCounts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | InventoryCountStatus>('all')
  const [warehouseFilter, setWarehouseFilter] = useState<'all' | string>('all')
  const [scopeFilter, setScopeFilter] = useState<'all' | InventoryCount['scope_type']>('all')
  const [blindFilter, setBlindFilter] = useState<'all' | 'yes' | 'no'>('all')
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [detailOpen, setDetailOpen] = useState(false)
  const [selectedCount, setSelectedCount] = useState<InventoryCount | null>(null)
  const [createOpen, setCreateOpen] = useState(false)
  const [createWarehouse, setCreateWarehouse] = useState<string>(mockInventoryCounts[0]?.wh_id ?? 'WH01')
  const [createScopeType, setCreateScopeType] = useState<InventoryCount['scope_type']>(mockInventoryCounts[0]?.scope_type ?? 'Warehouse')
  const [createBlindMode, setCreateBlindMode] = useState(false)
  const [columnVisibility, setColumnVisibility] = useState<Record<string, boolean>>({
    scope: true,
    blind: true,
    snapshot: true,
    created: true,
    submitted: true,
    zero: true
  })

  const warehouses = useMemo(
    () => Array.from(new Set(counts.map((count) => `${count.wh_id}|${count.wh_name}`))),
    [counts]
  )
  const scopes = useMemo(
    () => Array.from(new Set(counts.map((count) => count.scope_type))),
    [counts]
  )

  const handleOpenDetail = (count: InventoryCount) => {
    setSelectedCount(count)
    setDetailOpen(true)
  }

  const filteredCounts = useMemo(() => {
    return counts.filter((count) => {
      const term = searchTerm.trim().toLowerCase()
      const matchesSearch =
        term.length === 0 ||
        count.count_id.toLowerCase().includes(term) ||
        count.wh_name.toLowerCase().includes(term) ||
        count.note?.toLowerCase().includes(term) ||
        count.model_list.some((model) => model.name.toLowerCase().includes(term))

      const matchesStatus = statusFilter === 'all' || count.status === statusFilter
      const matchesWarehouse = warehouseFilter === 'all' || count.wh_id === warehouseFilter
      const matchesScope = scopeFilter === 'all' || count.scope_type === scopeFilter
      const matchesBlind =
        blindFilter === 'all' || (blindFilter === 'yes' ? count.blind_mode : !count.blind_mode)

      return matchesSearch && matchesStatus && matchesWarehouse && matchesScope && matchesBlind
    })
  }, [counts, searchTerm, statusFilter, warehouseFilter, scopeFilter, blindFilter])

  const totalPages = Math.max(1, Math.ceil(filteredCounts.length / pageSize))
  const currentPage = Math.min(page, totalPages)
  const pageStart = (currentPage - 1) * pageSize
  const paginatedCounts = filteredCounts.slice(pageStart, pageStart + pageSize)

  const columnConfig: ColumnConfig[] = [
    {
      id: 'count_id',
      label: 'Count ID',
      alwaysOn: true,
      render: (count) => (
        <div className="flex flex-col">
          <span className="font-medium">{count.count_id}</span>
          <span className="text-xs text-muted-foreground">{count.wh_name}</span>
        </div>
      )
    },
    {
      id: 'status',
      label: t.statusFilter,
      alwaysOn: true,
      render: (count) => (
        <Badge className={statusBadgeStyles[count.status]}>{t[`status${count.status}` as const]}</Badge>
      )
    },
    {
      id: 'scope',
      label: t.scopeFilter,
      render: (count) => count.scope_type
    },
    {
      id: 'blind',
      label: t.blindFilter,
      render: (count) => (
        <Badge className={count.blind_mode ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' : 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-100'}>
          {count.blind_mode ? t.blindYes : t.blindNo}
        </Badge>
      )
    },
    {
      id: 'snapshot',
      label: t.snapshotAt,
      render: (count) => formatDateTime(count.snapshot_at)
    },
    {
      id: 'created',
      label: t.createdBy,
      render: (count) => (
        <div className="flex flex-col">
          <span>{count.created_by}</span>
          <span className="text-xs text-muted-foreground">{formatDateTime(count.created_at)}</span>
        </div>
      )
    },
    {
      id: 'submitted',
      label: t.submittedBy,
      render: (count) => (
        <div className="flex flex-col">
          <span>{count.submitted_by ?? '—'}</span>
          <span className="text-xs text-muted-foreground">{formatDateTime(count.submitted_at)}</span>
        </div>
      )
    },
    {
      id: 'zero',
      label: t.zeroProgress,
      render: (count) => getZeroProgress(count)
    },
    {
      id: 'actions',
      label: t.actions,
      alwaysOn: true,
      render: (count) => (
        <Button size="sm" variant="outline" onClick={() => handleOpenDetail(count)}>
          <ListChecks className="mr-2 h-4 w-4" />
          {t.detailDialogTitle}
        </Button>
      ),
      className: 'text-right'
    }
  ]

  const visibleColumns = columnConfig.filter((column) => column.alwaysOn || columnVisibility[column.id] !== false)

  const clearFilters = () => {
    setStatusFilter('all')
    setWarehouseFilter('all')
    setScopeFilter('all')
    setBlindFilter('all')
    setPage(1)
  }

  const handleExport = () => {
    toast.success(t.export)
  }

  const handleCreate = () => {
    setCreateOpen(true)
  }

  const template = counts.find((count) => count.wh_id === createWarehouse) ?? counts[0]
  const scopePreviewLocations = template?.location_list ?? []
  const scopePreviewModels = template?.model_list ?? []

  const handleConfirmCreate = () => {
    const newId = generateCountId(createWarehouse, counts)
    const now = new Date().toISOString()
    const locationClones = scopePreviewLocations.map((location) => ({ ...location }))
    const modelClones = scopePreviewModels.map((model) => ({ ...model }))
    const newCount: InventoryCount = {
      count_id: newId,
      wh_id: createWarehouse,
      wh_name: template?.wh_name ?? createWarehouse,
      scope_type: createScopeType,
      location_list: locationClones,
      model_list: modelClones,
      blind_mode: createBlindMode,
      status: 'Draft',
      snapshot_at: now,
      created_by: 'Auto Planner',
      created_at: now,
      zero_required_locations: locationClones.map((location) => location.id),
      zero_completed_locations: [],
      lines: modelClones.map((model, index) => ({
        line_id: `${newId}-L${index + 1}`,
        count_id: newId,
        model_id: model.id,
        model_name: model.name,
        location_id: locationClones[index % Math.max(locationClones.length, 1)]?.id ?? template?.location_list[0]?.id ?? 'UNASSIGNED',
        location_name: locationClones[index % Math.max(locationClones.length, 1)]?.name ?? template?.location_list[0]?.name ?? 'Unassigned',
        uom_id: template?.lines[index]?.uom_id ?? 'EA',
        uom_name: template?.lines[index]?.uom_name ?? 'Each',
        tracking_type: model.tracking_type,
        system_qty: template?.lines[index]?.system_qty ?? 0,
        counted_qty: null,
        diff_qty: null,
        is_zeroed: false,
        is_unlisted: false,
        remark: ''
      })),
      details: [],
      audit_trail: [
        {
          id: `${newId}-AUD-1`,
          action: `Created count ${newId}`,
          actor: 'Auto Planner',
          role: 'Inventory Planner',
          timestamp: now,
          note: 'Scope generated from template and snapshot frozen.'
        }
      ],
      variance_report_url: undefined
    }

    setCounts((prev) => [newCount, ...prev])
    toast.success(t.createSuccess(newId))
    setCreateOpen(false)
    setSelectedCount(newCount)
    setDetailOpen(true)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t.create}
            </Button>
            <Button variant="secondary" onClick={handleExport}>
              <FileSpreadsheet className="mr-2 h-4 w-4" />
              {t.export}
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">
                  <Columns3 className="mr-2 h-4 w-4" />
                  {t.columns}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                {columnConfig
                  .filter((column) => !column.alwaysOn)
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      checked={columnVisibility[column.id] !== false}
                      onCheckedChange={(checked) =>
                        setColumnVisibility((prev) => ({
                          ...prev,
                          [column.id]: Boolean(checked)
                        }))
                      }
                    >
                      {column.label}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex w-full flex-col gap-2 md:w-auto md:flex-row md:items-center">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(event) => {
                  setSearchTerm(event.target.value)
                  setPage(1)
                }}
                placeholder={t.searchPlaceholder}
                className="pl-9"
              />
            </div>
            <Button variant="ghost" onClick={clearFilters}>
              <Filter className="mr-2 h-4 w-4" />
              {t.clearFilters}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 md:grid-cols-4">
            <Select value={statusFilter} onValueChange={(value) => {
              setStatusFilter(value as typeof statusFilter)
              setPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t.statusFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="Draft">{t.statusDraft}</SelectItem>
                <SelectItem value="Counting">{t.statusCounting}</SelectItem>
                <SelectItem value="Submitted">{t.statusSubmitted}</SelectItem>
                <SelectItem value="Completed">{t.statusCompleted}</SelectItem>
                <SelectItem value="Cancelled">{t.statusCancelled}</SelectItem>
              </SelectContent>
            </Select>

            <Select value={warehouseFilter} onValueChange={(value) => {
              setWarehouseFilter(value as typeof warehouseFilter)
              setPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t.warehouseFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allWarehouses}</SelectItem>
                {warehouses.map((warehouse) => {
                  const [id, name] = warehouse.split('|')
                  return (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  )
                })}
              </SelectContent>
            </Select>

            <Select value={scopeFilter} onValueChange={(value) => {
              setScopeFilter(value as typeof scopeFilter)
              setPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t.scopeFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allScopes}</SelectItem>
                {scopes.map((scope) => (
                  <SelectItem key={scope} value={scope}>
                    {scope}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={blindFilter} onValueChange={(value) => {
              setBlindFilter(value as typeof blindFilter)
              setPage(1)
            }}>
              <SelectTrigger>
                <SelectValue placeholder={t.blindFilter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.blindAll}</SelectItem>
                <SelectItem value="yes">{t.blindYes}</SelectItem>
                <SelectItem value="no">{t.blindNo}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Alert>
            <ListChecks className="h-4 w-4" />
            <AlertTitle>{t.doubleClickHint}</AlertTitle>
            <AlertDescription>{t.manualEntryHint}</AlertDescription>
          </Alert>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  {visibleColumns.map((column) => (
                    <TableHead key={column.id} className={column.className}>
                      {column.label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedCounts.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={visibleColumns.length} className="py-8 text-center text-sm text-muted-foreground">
                      {t.noResults}
                    </TableCell>
                  </TableRow>
                )}
                {paginatedCounts.map((count) => (
                  <TableRow key={count.count_id} onDoubleClick={() => handleOpenDetail(count)} className="cursor-pointer">
                    {visibleColumns.map((column) => (
                      <TableCell key={column.id} className={column.className}>
                        {column.render(count, t)}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              {t.showing} {filteredCounts.length === 0 ? 0 : pageStart + 1}–
              {Math.min(pageStart + pageSize, filteredCounts.length)} {t.of} {filteredCounts.length} {t.entries}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                {t.show}
                <Select value={String(pageSize)} onValueChange={(value) => {
                  setPageSize(Number(value))
                  setPage(1)
                }}>
                  <SelectTrigger className="h-8 w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {[10, 20, 50].map((size) => (
                      <SelectItem key={size} value={String(size)}>
                        {size} {t.perPage}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm text-muted-foreground">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <InventoryCountDetailDialog
        open={detailOpen}
        count={selectedCount}
        onOpenChange={setDetailOpen}
        t={t}
      />

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.createScopeTitle}</DialogTitle>
            <DialogDescription>{t.createScopeDescription}</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.formWarehouse}</label>
                <Select value={createWarehouse} onValueChange={(value) => setCreateWarehouse(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {warehouses.map((warehouse) => {
                      const [id, name] = warehouse.split('|')
                      return (
                        <SelectItem key={id} value={id}>
                          {name}
                        </SelectItem>
                      )
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">{t.formScope}</label>
                <Select value={createScopeType} onValueChange={(value) => setCreateScopeType(value as InventoryCount['scope_type'])}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(['Warehouse', 'Location', 'Model'] as InventoryCount['scope_type'][]).map((scope) => (
                      <SelectItem key={scope} value={scope}>
                        {scope}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox id="create-blind-mode" checked={createBlindMode} onCheckedChange={(checked) => setCreateBlindMode(Boolean(checked))} />
                <label htmlFor="create-blind-mode" className="text-sm">
                  {t.formBlind}
                </label>
              </div>
            </div>
            <div className="space-y-3">
              <h3 className="font-medium">{t.formPreview}</h3>
              <div>
                <span className="text-xs uppercase text-muted-foreground">{t.locations}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {scopePreviewLocations.length === 0 && <Badge variant="outline">—</Badge>}
                  {scopePreviewLocations.map((location) => (
                    <Badge key={location.id} variant="outline">{location.name}</Badge>
                  ))}
                </div>
              </div>
              <div>
                <span className="text-xs uppercase text-muted-foreground">{t.models}</span>
                <div className="mt-2 flex flex-wrap gap-2">
                  {scopePreviewModels.length === 0 && <Badge variant="outline">—</Badge>}
                  {scopePreviewModels.map((model) => (
                    <Badge key={model.id} className={`${trackingVariant[model.tracking_type]} border-transparent`}>
                      {model.name}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setCreateOpen(false)}>
              {t.cancel}
            </Button>
            <Button onClick={handleConfirmCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t.continue}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
