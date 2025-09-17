import { useEffect, useMemo, useState } from 'react'
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  FileText,
  MapPin,
  Package,
  ShieldCheck,
  UploadCloud,
  User
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Badge } from '../ui/badge'
import { Button } from '../ui/button'
import { Separator } from '../ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsIssue, GoodsIssueLine } from '../../types/goodsIssue'
import { getGoodsIssueById } from '../../data/mockGoodsIssueData'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from '../ui/dialog'

const translations = {
  en: {
    title: 'Goods Issue Detail',
    subtitle: 'Review picking result, track serial/lot allocation and approval history',
    information: 'Goods Issue Information',
    logistics: 'Logistics & Partner',
    attachments: 'Attachments',
    pickingResult: 'Picking Result by Model',
    trackingDialogTitle: 'Tracking Details',
    trackingDialogSubtitle: 'Selected serial/lot and actual picking log for this model',
    issueNo: 'Goods Issue No',
    issueType: 'Issue Type',
    issueMethod: 'Issue Method',
    createdBy: 'Created By',
    createdAt: 'Created At',
    submittedBy: 'Submitted By',
    submittedAt: 'Submitted At',
    approvedBy: 'Approved By',
    approvedAt: 'Approved At',
    expectedDate: 'Expected Issue Date',
    sourceWarehouse: 'Source Warehouse',
    destination: 'Destination / Partner',
    address: 'Address',
    remark: 'Remark',
    statusHistory: 'Status History',
    modelCode: 'Model Code',
    modelName: 'Model Name',
    tracking: 'Tracking Type',
    uom: 'Unit',
    qtyPlanned: 'Qty Planned',
    qtyPicked: 'Qty Picked',
    difference: 'Difference',
    lineStatus: 'Line Status',
    actions: 'Actions',
    view: 'View',
    totalPlanned: 'Total Planned',
    totalPicked: 'Total Picked',
    totalDifference: 'Total Difference',
    noRemark: 'No remark provided',
    noAttachments: 'No attachments uploaded',
    attachmentName: 'File name',
    attachmentUploadedBy: 'Uploaded by',
    attachmentUploadedAt: 'Uploaded at',
    serialNo: 'Serial Number',
    lotNo: 'Lot No',
    qty: 'Quantity',
    pickedBy: 'Picked By',
    pickedAt: 'Picked At',
    location: 'Location',
    note: 'Note',
    back: 'Back to Goods Issue',
    statusLabel: 'Status',
    exportPdf: 'Export PDF',
    approveAction: 'Approve',
    receivedDate: 'Lot Received Date',
    Draft: 'Draft',
    Picking: 'Picking',
    AdjustmentRequested: 'Adjustment Requested',
    Submitted: 'Submitted',
    Approved: 'Approved',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    Pending: 'Pending',
    Shortage: 'Shortage',
    Serial: 'Serial',
    Lot: 'Lot',
    Model: 'Model',
    None: 'None',
    SO: 'Sales Order',
    Transfer: 'Transfer',
    ReturnToSupplier: 'Return to Supplier',
    Adjustment: 'Adjustment',
    Manual: 'Manual'
  },
  vn: {
    title: 'Chi Tiết Phiếu Xuất Kho',
    subtitle: 'Kiểm tra kết quả picking, theo dõi serial/lot và lịch sử phê duyệt',
    information: 'Thông Tin Phiếu Xuất',
    logistics: 'Thông Tin Logistics & Đối Tác',
    attachments: 'Tài Liệu Đính Kèm',
    pickingResult: 'Kết Quả Picking Theo Model',
    trackingDialogTitle: 'Chi Tiết Tracking',
    trackingDialogSubtitle: 'Serial/Lot đã chọn và lịch sử picking của model này',
    issueNo: 'Số phiếu xuất',
    issueType: 'Loại phiếu',
    issueMethod: 'Phương thức xuất',
    createdBy: 'Tạo bởi',
    createdAt: 'Ngày tạo',
    submittedBy: 'Người gửi duyệt',
    submittedAt: 'Ngày gửi',
    approvedBy: 'Phê duyệt bởi',
    approvedAt: 'Ngày phê duyệt',
    expectedDate: 'Ngày xuất dự kiến',
    sourceWarehouse: 'Kho xuất',
    destination: 'Kho nhận / Đối tác',
    address: 'Địa chỉ',
    remark: 'Ghi chú',
    statusHistory: 'Lịch sử trạng thái',
    modelCode: 'Mã model',
    modelName: 'Tên model',
    tracking: 'Tracking',
    uom: 'Đơn vị',
    qtyPlanned: 'SL kế hoạch',
    qtyPicked: 'SL thực tế',
    difference: 'Chênh lệch',
    lineStatus: 'Trạng thái dòng',
    actions: 'Thao tác',
    view: 'Xem',
    totalPlanned: 'Tổng kế hoạch',
    totalPicked: 'Tổng thực tế',
    totalDifference: 'Tổng chênh lệch',
    noRemark: 'Không có ghi chú',
    noAttachments: 'Không có tài liệu đính kèm',
    attachmentName: 'Tên file',
    attachmentUploadedBy: 'Người tải lên',
    attachmentUploadedAt: 'Thời gian tải lên',
    serialNo: 'Số serial',
    lotNo: 'Số lot',
    qty: 'Số lượng',
    pickedBy: 'Người picking',
    pickedAt: 'Thời gian',
    location: 'Vị trí',
    note: 'Ghi chú',
    back: 'Quay lại danh sách',
    statusLabel: 'Trạng thái',
    exportPdf: 'Xuất PDF',
    approveAction: 'Phê duyệt',
    receivedDate: 'Ngày nhập lot',
    Draft: 'Nháp',
    Picking: 'Đang picking',
    AdjustmentRequested: 'Yêu cầu điều chỉnh',
    Submitted: 'Đã gửi',
    Approved: 'Đã duyệt',
    Completed: 'Hoàn tất',
    Cancelled: 'Đã hủy',
    Pending: 'Chờ xử lý',
    Shortage: 'Thiếu hàng',
    Serial: 'Serial',
    Lot: 'Lot',
    Model: 'Theo Model',
    None: 'Không tracking',
    SO: 'Đơn bán hàng',
    Transfer: 'Chuyển kho',
    ReturnToSupplier: 'Trả nhà cung cấp',
    Adjustment: 'Điều chỉnh',
    Manual: 'Thủ công'
  }
}

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Picking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  AdjustmentRequested: 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200',
  Submitted: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  Approved: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
} as const

interface GoodsIssueDetailProps {
  issueId?: string
}

export function GoodsIssueDetail({ issueId }: GoodsIssueDetailProps) {
  const { language } = useLanguage()
  const t = translations[language]

  const [issue, setIssue] = useState<GoodsIssue | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLine, setSelectedLine] = useState<GoodsIssueLine | null>(null)

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (issueId) {
        const found = getGoodsIssueById(issueId)
        setIssue(found || null)
      }
      setLoading(false)
    }, 300)

    return () => clearTimeout(timeout)
  }, [issueId])

  const summary = useMemo(() => {
    if (!issue) return { planned: 0, picked: 0, difference: 0 }

    const planned = issue.lines.reduce((acc, line) => acc + line.qty_planned, 0)
    const picked = issue.lines.reduce((acc, line) => acc + line.qty_picked, 0)
    return { planned, picked, difference: picked - planned }
  }, [issue])

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-issue'
  }

  const renderTrackingContent = (line: GoodsIssueLine) => {
    if (line.tracking_type === 'Serial') {
      return (
        <div className="space-y-2">
          {line.pickings.map(record => (
            <div key={record.id} className="rounded-lg border p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2 text-sm font-medium">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  <span>{t.serialNo}</span>
                </div>
                <Badge variant="outline">{record.serial_no}</Badge>
              </div>
              <Separator className="my-3" />
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>
                    {t.pickedBy}: {record.picked_by}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>
                    {t.pickedAt}: {new Date(record.picked_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>
                    {t.location}: {record.location_code || '-'}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )
    }

    if (line.tracking_type === 'Lot') {
      return (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t.lotNo}</TableHead>
              <TableHead>{t.qty}</TableHead>
              <TableHead>{t.pickedAt}</TableHead>
              <TableHead>{t.pickedBy}</TableHead>
              <TableHead>{t.location}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {line.pickings.map(record => (
              <TableRow key={record.id}>
                <TableCell>{record.lot_no}</TableCell>
                <TableCell>{record.qty_picked}</TableCell>
                <TableCell>
                  <div className="flex flex-col">
                    <span>{new Date(record.picked_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}</span>
                    {record.received_date && (
                      <span className="text-xs text-muted-foreground">
                        {t.receivedDate}: {new Date(record.received_date).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}
                      </span>
                    )}
                  </div>
                </TableCell>
                <TableCell>{record.picked_by}</TableCell>
                <TableCell>{record.location_code || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )
    }

    return (
      <div className="space-y-4">
        {line.pickings.map(record => (
          <div key={record.id} className="rounded-lg border p-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package className="h-4 w-4" />
                <span>
                  {t.qty}: {record.qty_picked}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <User className="h-4 w-4" />
                <span>
                  {t.pickedBy}: {record.picked_by}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>
                  {t.pickedAt}: {new Date(record.picked_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>
                  {t.location}: {record.location_code || '-'}
                </span>
              </div>
            </div>
            {record.note && (
              <p className="mt-3 text-sm italic text-muted-foreground">
                {t.note}: {record.note}
              </p>
            )}
          </div>
        ))}
      </div>
    )
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary" />
      </div>
    )
  }

  if (!issue) {
    return (
      <div className="space-y-4 p-6 text-center">
        <p className="text-muted-foreground">Goods issue not found</p>
        <Button onClick={handleBack}>{t.back}</Button>
      </div>
    )
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Button variant="ghost" size="sm" onClick={handleBack} className="-ml-2">
              <ArrowLeft className="mr-1 h-4 w-4" />
              {t.back}
            </Button>
            <Separator orientation="vertical" className="hidden h-5 md:block" />
            <span>
              {t.statusLabel}: <Badge className={statusColors[issue.status]}>{t[issue.status as keyof typeof t]}</Badge>
            </span>
          </div>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.subtitle}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline">
            <UploadCloud className="mr-2 h-4 w-4" />
            {t.exportPdf}
          </Button>
          <Button>
            <CheckCircle className="mr-2 h-4 w-4" />
            {t.approveAction}
          </Button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t.information}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.issueNo}</p>
                <p className="text-base font-semibold">{issue.gi_no}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.issueType}</p>
                <p>{t[issue.issue_type as keyof typeof t]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.issueMethod}</p>
                <p>{t[issue.issue_method as keyof typeof t]}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t.expectedDate}</p>
                <p>{new Date(issue.expected_date).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}</p>
              </div>
            </div>
            <Separator />
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <User className="h-4 w-4" />
                  <span>{t.createdBy}</span>
                </div>
                <p className="font-medium">{issue.created_by}</p>
                <p className="text-sm text-muted-foreground">
                  {t.createdAt}: {new Date(issue.created_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <ShieldCheck className="h-4 w-4" />
                  <span>{t.approvedBy}</span>
                </div>
                <p className="font-medium">{issue.approved_by || '-'}</p>
                <p className="text-sm text-muted-foreground">
                  {t.approvedAt}: {issue.approved_at ? new Date(issue.approved_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US') : '-'}
                </p>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UploadCloud className="h-4 w-4" />
                  <span>{t.submittedBy}</span>
                </div>
                <p className="font-medium">{issue.submitted_by || '-'}</p>
                <p className="text-sm text-muted-foreground">
                  {t.submittedAt}: {issue.submitted_at ? new Date(issue.submitted_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US') : '-'}
                </p>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <FileText className="h-4 w-4" />
                  <span>{t.remark}</span>
                </div>
                <p className="text-sm text-muted-foreground">{issue.remark || t.noRemark}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.statusHistory}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {issue.histories.map(history => (
              <div key={history.id} className="rounded-lg border p-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge className={statusColors[history.status]}>{t[history.status as keyof typeof t]}</Badge>
                  <span className="text-sm text-muted-foreground">
                    {new Date(history.timestamp).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}
                  </span>
                </div>
                <p className="mt-2 text-sm font-medium">{history.action}</p>
                <p className="text-sm text-muted-foreground">{history.actor}</p>
                {history.remark && (
                  <p className="mt-1 text-sm italic text-muted-foreground">{history.remark}</p>
                )}
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-[2fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{t.pickingResult}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.modelCode}</TableHead>
                    <TableHead>{t.modelName}</TableHead>
                    <TableHead>{t.tracking}</TableHead>
                    <TableHead>{t.uom}</TableHead>
                    <TableHead>{t.qtyPlanned}</TableHead>
                    <TableHead>{t.qtyPicked}</TableHead>
                    <TableHead>{t.difference}</TableHead>
                    <TableHead>{t.lineStatus}</TableHead>
                    <TableHead className="text-right">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {issue.lines.map(line => (
                    <TableRow key={line.id}>
                      <TableCell>{line.model_code}</TableCell>
                      <TableCell>{line.model_name}</TableCell>
                      <TableCell>{t[line.tracking_type as keyof typeof t]}</TableCell>
                      <TableCell>{line.uom_code}</TableCell>
                      <TableCell>{line.qty_planned}</TableCell>
                      <TableCell>{line.qty_picked}</TableCell>
                      <TableCell>
                        <span className={line.difference < 0 ? 'text-destructive' : line.difference > 0 ? 'text-emerald-600' : ''}>
                          {line.difference}
                        </span>
                      </TableCell>
                      <TableCell>
                        <Badge variant={line.status === 'Completed' ? 'default' : line.status === 'Shortage' ? 'destructive' : 'secondary'}>
                          {t[line.status as keyof typeof t]}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" onClick={() => setSelectedLine(line)}>
                          {t.view}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-3">
              <div>
                <span className="font-medium text-foreground">{t.totalPlanned}:</span> {summary.planned}
              </div>
              <div>
                <span className="font-medium text-foreground">{t.totalPicked}:</span> {summary.picked}
              </div>
              <div>
                <span className="font-medium text-foreground">{t.totalDifference}:</span>{' '}
                <span className={summary.difference < 0 ? 'text-destructive' : summary.difference > 0 ? 'text-emerald-600' : ''}>
                  {summary.difference}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t.logistics}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{t.sourceWarehouse}</span>
              </div>
              <p className="font-medium">{issue.from_wh_name}</p>
              <p className="text-sm text-muted-foreground">{issue.from_wh_code}</p>
            </div>
            {(issue.to_wh_name || issue.partner_name) && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  <span>{t.destination}</span>
                </div>
                <p className="font-medium">{issue.to_wh_name || issue.partner_name}</p>
                <p className="text-sm text-muted-foreground">{issue.to_wh_code || issue.partner_code || '-'}</p>
              </div>
            )}
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <FileText className="h-4 w-4" />
                <span>{t.attachments}</span>
              </div>
              {issue.attachments.length === 0 ? (
                <p className="text-sm text-muted-foreground">{t.noAttachments}</p>
              ) : (
                <div className="space-y-3">
                  {issue.attachments.map(file => (
                    <div key={file.id} className="rounded-md border p-3">
                      <p className="text-sm font-medium">{t.attachmentName}: {file.filename}</p>
                      <p className="text-xs text-muted-foreground">
                        {t.attachmentUploadedBy}: {file.uploaded_by}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {t.attachmentUploadedAt}:{' '}
                        {new Date(file.uploaded_at).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={!!selectedLine} onOpenChange={open => !open && setSelectedLine(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{t.trackingDialogTitle}</DialogTitle>
            <DialogDescription>
              {t.trackingDialogSubtitle}
            </DialogDescription>
          </DialogHeader>
          {selectedLine && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">{t.modelCode}</p>
                  <p className="font-medium">{selectedLine.model_code}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.modelName}</p>
                  <p className="font-medium">{selectedLine.model_name}</p>
                </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{t.tracking}</p>
                    <p className="font-medium">{t[selectedLine.tracking_type as keyof typeof t]}</p>
                  </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t.qtyPicked}</p>
                  <p className="font-medium">{selectedLine.qty_picked}</p>
                </div>
              </div>
              <Separator />
              {renderTrackingContent(selectedLine)}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
