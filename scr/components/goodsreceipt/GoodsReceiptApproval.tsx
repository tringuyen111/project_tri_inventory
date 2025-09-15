import { useState, useMemo } from 'react'
import { ArrowLeft, CheckCircle2, XCircle, AlertTriangle, Clock, History, Download, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs'
import { Alert, AlertDescription } from '../ui/alert'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Separator } from '../ui/separator'
import { ScrollArea } from '../ui/scroll-area'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsReceipt, GoodsReceiptWarning, GoodsReceiptActualRecord, GoodsReceiptAuditLog } from '../../types/goodsReceipt'
import { mockGoodsReceipts, mockWarnings, mockAuditLogs } from '../../data/mockGoodsReceiptData'
import { GoodsReceiptSpecialActions } from './GoodsReceiptSpecialActions'
import { toast } from 'sonner@2.0.3'

const translations = {
  en: {
    title: 'Goods Receipt Approval',
    back: 'Back to List',
    receiptNo: 'Receipt No',
    type: 'Type',
    reference: 'Reference',
    partner: 'Partner / Source',
    destination: 'Destination',
    expectedDate: 'Expected Date',
    status: 'Status',
    submittedAt: 'Submitted At',
    submittedBy: 'Submitted By',
    summary: 'Summary',
    totalLines: 'Total Lines',
    totalQtyPlanned: 'Total Qty Planned',
    totalQtyReceived: 'Total Qty Received',
    overUnderFlag: 'Receipt Status',
    review: 'Review',
    trackingDetails: 'Tracking Details',
    warnings: 'Warnings',
    actions: 'Actions',
    approve: 'Approve',
    reject: 'Reject',
    viewHistory: 'View History',
    downloadDetail: 'Download Detail',
    // Line grid headers
    modelCode: 'Model Code',
    modelName: 'Model Name',
    trackingType: 'Tracking Type',
    qtyPlanned: 'Qty Planned',
    qtyReceived: 'Qty Received',
    qtyRemaining: 'Qty Remaining',
    lineBin: 'Line Bin',
    // Tracking detail headers
    barcode: 'Barcode',
    binLocation: 'Bin Location',
    receivedAt: 'Received At',
    receivedBy: 'Received By',
    lotNo: 'Lot No',
    mfgDate: 'Mfg Date',
    expDate: 'Exp Date',
    quantity: 'Quantity',
    notes: 'Notes',
    // Approval actions
    approveConfirm: 'Approve Receipt',
    rejectConfirm: 'Reject Receipt',
    approveNote: 'Approval Note (Optional)',
    rejectReason: 'Rejection Reason (Required)',
    cancel: 'Cancel',
    confirm: 'Confirm',
    // Status translations
    Draft: 'Draft',
    Receiving: 'Receiving',
    Submitted: 'Submitted',
    Completed: 'Completed',
    Rejected: 'Rejected',
    // Type translations
    PO: 'Purchase Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Manual: 'Manual Entry',
    // Over/Under flags
    over: 'Over Receipt',
    under: 'Under Receipt',
    exact: 'Exact Match',
    // Warning types
    over_receipt: 'Over Receipt Warning',
    under_receipt: 'Under Receipt Warning',
    duplicate_barcode: 'Duplicate Barcode',
    missing_lot_info: 'Missing Lot Information',
    invalid_bin: 'Invalid Bin Location',
    // Tracking types
    Serial: 'Serial',
    Lot: 'Lot',
    None: 'None',
    // Audit log
    historyTitle: 'Receipt History',
    action: 'Action',
    user: 'User',
    timestamp: 'Timestamp',
    details: 'Details',
    // Messages
    approveSuccess: 'Receipt approved successfully',
    rejectSuccess: 'Receipt rejected successfully',
    permissionError: 'You do not have permission to approve this receipt',
    statusError: 'Receipt status does not allow approval',
    validationError: 'Validation errors prevent approval',
    noActualRecords: 'No actual receiving records found',
    // Actions in history
    created: 'Created',
    updated: 'Updated',
    submitted: 'Submitted',
    approved: 'Approved',
    rejected: 'Rejected',
    cancelled: 'Cancelled',
    reversed: 'Reversed'
  },
  vn: {
    title: 'Phê Duyệt Phiếu Nhập Kho',
    back: 'Quay Lại Danh Sách',
    receiptNo: 'Số Phiếu',
    type: 'Loại',
    reference: 'Tham Chiếu',
    partner: 'Đối Tác / Nguồn',
    destination: 'Đích Đến',
    expectedDate: 'Ngày Dự Kiến',
    status: 'Trạng Thái',
    submittedAt: 'Gửi Lúc',
    submittedBy: 'Người Gửi',
    summary: 'Tóm Tắt',
    totalLines: 'Tổng Số Dòng',
    totalQtyPlanned: 'Tổng SL Dự Kiến',
    totalQtyReceived: 'Tổng SL Nhận',
    overUnderFlag: 'Trạng Thái Nhận',
    review: 'Xem Xét',
    trackingDetails: 'Chi Tiết Theo Dõi',
    warnings: 'Cảnh Báo',
    actions: 'Thao Tác',
    approve: 'Phê Duyệt',
    reject: 'Từ Chối',
    viewHistory: 'Xem Lịch Sử',
    downloadDetail: 'Tải Chi Tiết',
    // Line grid headers
    modelCode: 'Mã Model',
    modelName: 'Tên Model',
    trackingType: 'Loại Theo Dõi',
    qtyPlanned: 'SL Dự Kiến',
    qtyReceived: 'SL Nhận',
    qtyRemaining: 'SL Còn Lại',
    lineBin: 'Vị Trí Dòng',
    // Tracking detail headers
    barcode: 'Mã Vạch',
    binLocation: 'Vị Trí Bin',
    receivedAt: 'Nhận Lúc',
    receivedBy: 'Người Nhận',
    lotNo: 'Số Lô',
    mfgDate: 'Ngày SX',
    expDate: 'Ngày HH',
    quantity: 'Số Lượng',
    notes: 'Ghi Chú',
    // Approval actions
    approveConfirm: 'Phê Duyệt Phiếu',
    rejectConfirm: 'Từ Chối Phiếu',
    approveNote: 'Ghi Chú Phê Duyệt (Tùy Chọn)',
    rejectReason: 'Lý Do Từ Chối (Bắt Buộc)',
    cancel: 'Hủy',
    confirm: 'Xác Nhận',
    // Status translations
    Draft: 'Nháp',
    Receiving: 'Đang Nhận',
    Submitted: 'Đã Gửi',
    Completed: 'Hoàn Thành',
    Rejected: 'Từ Chối',
    // Type translations
    PO: 'Đơn Mua Hàng',
    Transfer: 'Chuyển Kho',
    Return: 'Trả Hàng',
    Manual: 'Nhập Thủ Công',
    // Over/Under flags
    over: 'Nhận Thừa',
    under: 'Nhận Thiếu',
    exact: 'Chính Xác',
    // Warning types
    over_receipt: 'Cảnh Báo Nhận Thừa',
    under_receipt: 'Cảnh Báo Nhận Thiếu',
    duplicate_barcode: 'Trùng Mã Vạch',
    missing_lot_info: 'Thiếu Thông Tin Lô',
    invalid_bin: 'Vị Trí Bin Không Hợp Lệ',
    // Tracking types
    Serial: 'Serial',
    Lot: 'Lô',
    None: 'Không',
    // Audit log
    historyTitle: 'Lịch Sử Phiếu',
    action: 'Hành Động',
    user: 'Người Dùng',
    timestamp: 'Thời Gian',
    details: 'Chi Tiết',
    // Messages
    approveSuccess: 'Phê duyệt phiếu thành công',
    rejectSuccess: 'Từ chối phiếu thành công',
    permissionError: 'Bạn không có quyền phê duyệt phiếu này',
    statusError: 'Trạng thái phiếu không cho phép phê duyệt',
    validationError: 'Lỗi xác thực ngăn cản phê duyệt',
    noActualRecords: 'Không tìm thấy bản ghi nhận hàng thực tế',
    // Actions in history
    created: 'Đã Tạo',
    updated: 'Đã Cập Nhật',
    submitted: 'Đã Gửi',
    approved: 'Đã Phê Duyệt',
    rejected: 'Đã Từ Chối',
    cancelled: 'Đã Hủy',
    reversed: 'Đã Đảo Ngược'
  }
}

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Receiving: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const overUnderColors = {
  over: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  under: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  exact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

const warningColors = {
  over_receipt: 'bg-orange-50 border-orange-200 text-orange-800',
  under_receipt: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  duplicate_barcode: 'bg-red-50 border-red-200 text-red-800',
  missing_lot_info: 'bg-red-50 border-red-200 text-red-800',
  invalid_bin: 'bg-red-50 border-red-200 text-red-800'
}

interface GoodsReceiptApprovalProps {
  receiptId: string
  onBack: () => void
}

export function GoodsReceiptApproval({ receiptId, onBack }: GoodsReceiptApprovalProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [receipt, setReceipt] = useState<GoodsReceipt | null>(() => 
    mockGoodsReceipts.find(r => r.id === receiptId) || null
  )
  const [warnings] = useState<GoodsReceiptWarning[]>(mockWarnings)
  const [auditLogs] = useState<GoodsReceiptAuditLog[]>(mockAuditLogs)
  const [selectedLine, setSelectedLine] = useState<string | null>(null)
  const [approveNote, setApproveNote] = useState('')
  const [rejectReason, setRejectReason] = useState('')
  const [showApproveDialog, setShowApproveDialog] = useState(false)
  const [showRejectDialog, setShowRejectDialog] = useState(false)
  const [showHistoryDialog, setShowHistoryDialog] = useState(false)

  if (!receipt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
        </div>
        <Alert>
          <AlertTriangle className="w-4 h-4" />
          <AlertDescription>Receipt not found</AlertDescription>
        </Alert>
      </div>
    )
  }

  const blockingWarnings = warnings.filter(w => w.blocking)
  const nonBlockingWarnings = warnings.filter(w => !w.blocking)
  const canApprove = receipt.status === 'Submitted' && blockingWarnings.length === 0

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')
  }

  const getPartnerOrSource = () => {
    if (receipt.receipt_type === 'Transfer') {
      return receipt.from_wh_name || '-'
    } else if (receipt.receipt_type === 'PO' || receipt.receipt_type === 'Return') {
      return receipt.partner_name || '-'
    }
    return '-'
  }

  const handleApprove = () => {
    if (!canApprove) {
      toast.error(t.validationError)
      return
    }

    // Simulate approval process
    const updatedReceipt = {
      ...receipt,
      status: 'Completed' as const,
      approved_at: new Date().toISOString(),
      approved_by: 'warehouse_manager',
      approved_note: approveNote || undefined
    }
    
    setReceipt(updatedReceipt)
    setShowApproveDialog(false)
    setApproveNote('')
    toast.success(t.approveSuccess)
  }

  const handleReject = () => {
    if (!rejectReason.trim()) {
      toast.error('Rejection reason is required')
      return
    }

    // Simulate rejection process
    const updatedReceipt = {
      ...receipt,
      status: 'Rejected' as const,
      rejected_at: new Date().toISOString(),
      rejected_by: 'warehouse_manager',
      rejected_reason: rejectReason
    }
    
    setReceipt(updatedReceipt)
    setShowRejectDialog(false)
    setRejectReason('')
    toast.success(t.rejectSuccess)
  }

  const downloadDetail = () => {
    // Simulate CSV download
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [
        'Receipt No,Model Code,Model Name,Tracking Type,Qty Planned,Qty Received,Status',
        ...receipt.lines.map(line => [
          receipt.receipt_no,
          line.model_code,
          line.model_name,
          line.tracking_type,
          line.qty_planned,
          line.qty_received || 0,
          receipt.status
        ].join(','))
      ].join('\\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', `receipt_detail_${receipt.receipt_no}.csv`)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.back}
          </Button>
          <div>
            <h1>{t.title}</h1>
            <p className="text-muted-foreground">{receipt.receipt_no}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowHistoryDialog(true)}>
            <History className="w-4 h-4 mr-2" />
            {t.viewHistory}
          </Button>
          <Button variant="outline" onClick={downloadDetail}>
            <Download className="w-4 h-4 mr-2" />
            {t.downloadDetail}
          </Button>
        </div>
      </div>

      {/* Receipt Header */}
      <Card>
        <CardHeader>
          <CardTitle>{t.receiptNo}: {receipt.receipt_no}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label>{t.type}</Label>
              <Badge variant="outline" className="mt-1">
                {t[receipt.receipt_type as keyof typeof t]}
              </Badge>
            </div>
            <div>
              <Label>{t.reference}</Label>
              <p>{receipt.ref_no || '-'}</p>
            </div>
            <div>
              <Label>{t.partner}</Label>
              <p>{getPartnerOrSource()}</p>
            </div>
            <div>
              <Label>{t.destination}</Label>
              <p>{receipt.to_wh_name}</p>
            </div>
            <div>
              <Label>{t.expectedDate}</Label>
              <p>{formatDateOnly(receipt.expected_date)}</p>
            </div>
            <div>
              <Label>{t.status}</Label>
              <Badge className={statusColors[receipt.status]} variant="secondary">
                {t[receipt.status as keyof typeof t]}
              </Badge>
            </div>
            {receipt.submitted_at && (
              <div>
                <Label>{t.submittedAt}</Label>
                <p>{formatDate(receipt.submitted_at)}</p>
              </div>
            )}
            {receipt.submitted_by && (
              <div>
                <Label>{t.submittedBy}</Label>
                <p>{receipt.submitted_by}</p>
              </div>
            )}
            {receipt.submit_note && (
              <div className="md:col-span-2">
                <Label>Submit Note</Label>
                <p className="text-sm bg-muted p-2 rounded">{receipt.submit_note}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t.summary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>{t.totalLines}</Label>
              <p className="text-2xl font-semibold">{receipt.total_lines || receipt.lines.length}</p>
            </div>
            <div>
              <Label>{t.totalQtyPlanned}</Label>
              <p className="text-2xl font-semibold">{receipt.total_qty_planned || receipt.lines.reduce((sum, line) => sum + line.qty_planned, 0)}</p>
            </div>
            <div>
              <Label>{t.totalQtyReceived}</Label>
              <p className="text-2xl font-semibold">{receipt.total_qty_received || receipt.lines.reduce((sum, line) => sum + (line.qty_received || 0), 0)}</p>
            </div>
            <div>
              <Label>{t.overUnderFlag}</Label>
              <Badge className={overUnderColors[receipt.over_under_flag || 'exact']} variant="secondary">
                {t[receipt.over_under_flag || 'exact' as keyof typeof t]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {warnings.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
              {t.warnings}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {warnings.map((warning, index) => (
                <Alert key={index} className={warningColors[warning.type]}>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>
                    <div className="flex items-center justify-between">
                      <span>{warning.message}</span>
                      {warning.blocking && (
                        <Badge variant="destructive" className="ml-2">Blocking</Badge>
                      )}
                    </div>
                  </AlertDescription>
                </Alert>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs defaultValue="review" className="space-y-4">
        <TabsList>
          <TabsTrigger value="review">{t.review}</TabsTrigger>
          <TabsTrigger value="tracking">{t.trackingDetails}</TabsTrigger>
          <TabsTrigger value="special">Special Cases</TabsTrigger>
        </TabsList>

        <TabsContent value="review">
          <Card>
            <CardHeader>
              <CardTitle>{t.review}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t.modelCode}</TableHead>
                      <TableHead>{t.modelName}</TableHead>
                      <TableHead>{t.trackingType}</TableHead>
                      <TableHead className="text-right">{t.qtyPlanned}</TableHead>
                      <TableHead className="text-right">{t.qtyReceived}</TableHead>
                      <TableHead className="text-right">{t.qtyRemaining}</TableHead>
                      <TableHead>{t.lineBin}</TableHead>
                      <TableHead className="w-[100px]">{t.actions}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.lines.map((line) => (
                      <TableRow key={line.id}>
                        <TableCell className="font-mono">{line.model_code}</TableCell>
                        <TableCell>{line.model_name}</TableCell>
                        <TableCell>
                          <Badge variant="outline">
                            {t[line.tracking_type as keyof typeof t]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">{line.qty_planned}</TableCell>
                        <TableCell className="text-right">{line.qty_received || 0}</TableCell>
                        <TableCell className="text-right">{line.qty_remaining || 0}</TableCell>
                        <TableCell>{line.line_bin || '-'}</TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setSelectedLine(line.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="tracking">
          <Card>
            <CardHeader>
              <CardTitle>{t.trackingDetails}</CardTitle>
            </CardHeader>
            <CardContent>
              {selectedLine ? (
                (() => {
                  const line = receipt.lines.find(l => l.id === selectedLine)
                  if (!line || !line.actual_records || line.actual_records.length === 0) {
                    return (
                      <Alert>
                        <AlertTriangle className="w-4 h-4" />
                        <AlertDescription>{t.noActualRecords}</AlertDescription>
                      </Alert>
                    )
                  }

                  return (
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-lg font-semibold">{line.model_name}</h3>
                        <Badge variant="outline">{t[line.tracking_type as keyof typeof t]}</Badge>
                      </div>
                      <div className="rounded-md border">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              {line.tracking_type === 'Serial' && <TableHead>{t.barcode}</TableHead>}
                              {line.tracking_type === 'Lot' && (
                                <>
                                  <TableHead>{t.lotNo}</TableHead>
                                  <TableHead>{t.mfgDate}</TableHead>
                                  <TableHead>{t.expDate}</TableHead>
                                </>
                              )}
                              {line.tracking_type === 'None' && <TableHead>{t.quantity}</TableHead>}
                              <TableHead>{t.binLocation}</TableHead>
                              <TableHead>{t.receivedAt}</TableHead>
                              <TableHead>{t.receivedBy}</TableHead>
                              <TableHead>{t.notes}</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {line.actual_records.map((record) => (
                              <TableRow key={record.id}>
                                {line.tracking_type === 'Serial' && (
                                  <TableCell className="font-mono">{record.barcode}</TableCell>
                                )}
                                {line.tracking_type === 'Lot' && (
                                  <>
                                    <TableCell>{record.lot_no}</TableCell>
                                    <TableCell>{record.mfg_date ? formatDateOnly(record.mfg_date) : '-'}</TableCell>
                                    <TableCell>{record.exp_date ? formatDateOnly(record.exp_date) : '-'}</TableCell>
                                  </>
                                )}
                                {line.tracking_type === 'None' && (
                                  <TableCell>{record.qty_actual}</TableCell>
                                )}
                                <TableCell>{record.bin_code}</TableCell>
                                <TableCell>{formatDate(record.received_at)}</TableCell>
                                <TableCell>{record.received_by}</TableCell>
                                <TableCell>{record.notes || '-'}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )
                })()
              ) : (
                <Alert>
                  <AlertTriangle className="w-4 h-4" />
                  <AlertDescription>Select a line from the Review tab to view tracking details</AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="special">
          <Card>
            <CardHeader>
              <CardTitle>Special Cases & Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <GoodsReceiptSpecialActions 
                receipt={receipt} 
                onReceiptUpdate={setReceipt}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Actions */}
      {receipt.status === 'Submitted' && (
        <Card>
          <CardHeader>
            <CardTitle>{t.actions}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex space-x-4">
              <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
                <DialogTrigger asChild>
                  <Button 
                    disabled={!canApprove}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    {t.approve}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.approveConfirm}</DialogTitle>
                    <DialogDescription>
                      Approve receipt {receipt.receipt_no} and change status to Completed?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="approveNote">{t.approveNote}</Label>
                      <Textarea
                        id="approveNote"
                        value={approveNote}
                        onChange={(e) => setApproveNote(e.target.value)}
                        placeholder="Add approval note..."
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
                        {t.cancel}
                      </Button>
                      <Button onClick={handleApprove}>
                        {t.confirm}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
                <DialogTrigger asChild>
                  <Button variant="destructive">
                    <XCircle className="w-4 h-4 mr-2" />
                    {t.reject}
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>{t.rejectConfirm}</DialogTitle>
                    <DialogDescription>
                      Reject receipt {receipt.receipt_no} and change status back to Receiving?
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="rejectReason">{t.rejectReason}</Label>
                      <Textarea
                        id="rejectReason"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Enter rejection reason..."
                        required
                      />
                    </div>
                    <div className="flex justify-end space-x-2">
                      <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
                        {t.cancel}
                      </Button>
                      <Button variant="destructive" onClick={handleReject}>
                        {t.confirm}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </CardContent>
        </Card>
      )}

      {/* History Dialog */}
      <Dialog open={showHistoryDialog} onOpenChange={setShowHistoryDialog}>
        <DialogContent className="max-w-4xl max-h-[80vh]">
          <DialogHeader>
            <DialogTitle>{t.historyTitle}</DialogTitle>
            <DialogDescription>
              Complete audit log for receipt {receipt.receipt_no}
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[60vh]">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.action}</TableHead>
                    <TableHead>{t.user}</TableHead>
                    <TableHead>{t.timestamp}</TableHead>
                    <TableHead>{t.details}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell>
                        <Badge variant="outline">
                          {t[log.action as keyof typeof t]}
                        </Badge>
                      </TableCell>
                      <TableCell>{log.user_name}</TableCell>
                      <TableCell>{formatDate(log.timestamp)}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  )
}