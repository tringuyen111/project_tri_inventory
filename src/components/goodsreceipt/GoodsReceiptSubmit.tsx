import { useState, useMemo } from 'react'
import { ArrowLeft, Send, AlertTriangle, Package, CheckCircle2, AlertCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Textarea } from '../ui/textarea'
import { Label } from '../ui/label'
import { Alert, AlertDescription } from '../ui/alert'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '../ui/alert-dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockGoodsReceipts } from '../../data/mockGoodsReceiptData'
import { GoodsReceipt, GoodsReceiptLine } from '../../types/goodsReceipt'
import { toast } from 'sonner'

const translations = {
  en: {
    title: 'Submit Goods Receipt for Approval',
    backToList: 'Back to List',
    receiptHeader: 'Receipt Information',
    receiptNo: 'Receipt No',
    receiptType: 'Receipt Type',
    reference: 'Reference',
    partner: 'Partner / Source',
    destination: 'Destination Warehouse',
    expectedDate: 'Expected Date',
    status: 'Status',
    receiptSummary: 'Receipt Summary',
    totalLines: 'Total Lines',
    totalPlanned: 'Total Planned Qty',
    totalReceived: 'Total Received Qty',
    overUnderFlag: 'Receipt Status',
    lineDetails: 'Line Details',
    modelCode: 'Model Code',
    modelName: 'Model Name',
    trackingType: 'Tracking',
    qtyPlanned: 'Qty Planned',
    qtyReceived: 'Qty Received',
    qtyRemaining: 'Qty Remaining',
    lineBin: 'Primary Bin',
    trackingDetails: 'Tracking Details',
    submitSection: 'Submit for Approval',
    submitNote: 'Submit Note (Optional)',
    submitNotePlaceholder: 'Enter any additional notes for the approver...',
    submitButton: 'Submit for Approval',
    warnings: 'Warnings & Validations',
    confirmSubmit: 'Confirm Submission',
    confirmSubmitDescription: 'Are you sure you want to submit this receipt for approval? After submission, you will not be able to modify the receiving records.',
    cancel: 'Cancel',
    submit: 'Submit',
    serialTracking: 'Serial Tracking',
    lotTracking: 'Lot Tracking',
    noTracking: 'None',
    // Type translations
    PO: 'Purchase Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Manual: 'Manual Entry',
    // Status
    Receiving: 'Receiving',
    exact: 'Exact',
    over: 'Over Receipt',
    under: 'Under Receipt',
    // Validation messages
    validationPassed: 'All validations passed. Ready to submit.',
    hasActualRecords: 'Receipt has actual receiving records',
    noActualRecords: 'No actual receiving records found. Cannot submit.',
    statusNotReceiving: 'Receipt status is not "Receiving". Cannot submit.',
    serialDetails: 'Serial Numbers',
    lotDetails: 'Lot Information',
    noneDetails: 'Quantity Records',
    lotNo: 'Lot Number',
    mfgDate: 'Manufacturing Date',
    expDate: 'Expiry Date',
    binLocation: 'Bin Location',
    receivedAt: 'Received At',
    receivedBy: 'Received By',
    quantity: 'Quantity',
    barcode: 'Barcode',
    notes: 'Notes'
  },
  vn: {
    title: 'Gửi Phiếu Nhập Chờ Duyệt',
    backToList: 'Về Danh Sách',
    receiptHeader: 'Thông Tin Phiếu',
    receiptNo: 'Số Phiếu',
    receiptType: 'Loại Phiếu',
    reference: 'Tham Chiếu',
    partner: 'Đối Tác / Nguồn',
    destination: 'Kho Đích',
    expectedDate: 'Ngày Dự Kiến',
    status: 'Trạng Thái',
    receiptSummary: 'Tóm Tắt Phiếu',
    totalLines: 'Tổng Dòng',
    totalPlanned: 'Tổng SL Kế Hoạch',
    totalReceived: 'Tổng SL Nhận',
    overUnderFlag: 'Tình Trạng Nhận',
    lineDetails: 'Chi Tiết Dòng',
    modelCode: 'Mã Model',
    modelName: 'Tên Model',
    trackingType: 'Theo Dõi',
    qtyPlanned: 'SL Kế Hoạch',
    qtyReceived: 'SL Nhận',
    qtyRemaining: 'SL Còn Lại',
    lineBin: 'Bin Chính',
    trackingDetails: 'Chi Tiết Theo Dõi',
    submitSection: 'Gửi Chờ Duyệt',
    submitNote: 'Ghi Chú Gửi (Tùy Chọn)',
    submitNotePlaceholder: 'Nhập ghi chú bổ sung cho người phê duyệt...',
    submitButton: 'Gửi Chờ Duyệt',
    warnings: 'Cảnh Báo & Kiểm Tra',
    confirmSubmit: 'Xác Nhận Gửi',
    confirmSubmitDescription: 'Bạn có chắc chắn muốn gửi phiếu này chờ duyệt? Sau khi gửi, bạn sẽ không thể chỉnh sửa các bản ghi nhận hàng.',
    cancel: 'Hủy',
    submit: 'Gửi',
    serialTracking: 'Theo Serial',
    lotTracking: 'Theo Lô',
    noTracking: 'Không',
    // Type translations
    PO: 'Đơn Mua Hàng',
    Transfer: 'Chuyển Kho',
    Return: 'Trả Hàng',
    Manual: 'Nhập Thủ Công',
    // Status
    Receiving: 'Đang Nhận',
    exact: 'Đúng',
    over: 'Nhận Thừa',
    under: 'Nhận Thiếu',
    // Validation messages
    validationPassed: 'Tất cả kiểm tra đã qua. Sẵn sàng gửi.',
    hasActualRecords: 'Phiếu có bản ghi nhận hàng thực tế',
    noActualRecords: 'Không tìm thấy bản ghi nhận hàng thực tế. Không thể gửi.',
    statusNotReceiving: 'Trạng thái phiếu không phải "Đang Nhận". Không thể gửi.',
    serialDetails: 'Số Serial',
    lotDetails: 'Thông Tin Lô',
    noneDetails: 'Bản Ghi Số Lượng',
    lotNo: 'Số Lô',
    mfgDate: 'Ngày Sản Xuất',
    expDate: 'Ngày Hết Hạn',
    binLocation: 'Vị Trí Bin',
    receivedAt: 'Nhận Lúc',
    receivedBy: 'Nhận Bởi',
    quantity: 'Số Lượng',
    barcode: 'Mã Vạch',
    notes: 'Ghi Chú'
  }
}

const statusColors = {
  exact: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  over: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  under: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
}

interface GoodsReceiptSubmitProps {
  receiptId: string
  onBack: () => void
}

export function GoodsReceiptSubmit({ receiptId, onBack }: GoodsReceiptSubmitProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [submitNote, setSubmitNote] = useState('')
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [selectedLine, setSelectedLine] = useState<GoodsReceiptLine | null>(null)
  
  // Find the receipt data
  const receipt = mockGoodsReceipts.find(r => r.id === receiptId)
  
  if (!receipt) {
    return (
      <div className="text-center py-8">
        <p>Receipt not found</p>
        <Button onClick={onBack} className="mt-4">
          {t.backToList}
        </Button>
      </div>
    )
  }

  // Calculate actual quantities from actual_records
  const linesWithCalculatedQty = useMemo(() => {
    return receipt.lines.map(line => {
      const actualRecords = line.actual_records || []
      const qtyReceived = actualRecords.reduce((sum, record) => sum + (record.qty_actual || 0), 0)
      const qtyRemaining = Math.max(0, line.qty_planned - qtyReceived)
      
      return {
        ...line,
        qty_received: qtyReceived,
        qty_remaining: qtyRemaining
      }
    })
  }, [receipt.lines])

  // Calculate summary
  const summary = useMemo(() => {
    const totalLines = linesWithCalculatedQty.length
    const totalQtyPlanned = linesWithCalculatedQty.reduce((sum, line) => sum + line.qty_planned, 0)
    const totalQtyReceived = linesWithCalculatedQty.reduce((sum, line) => sum + (line.qty_received || 0), 0)
    
    let overUnderFlag: 'exact' | 'over' | 'under' = 'exact'
    if (totalQtyReceived > totalQtyPlanned) overUnderFlag = 'over'
    else if (totalQtyReceived < totalQtyPlanned) overUnderFlag = 'under'
    
    return {
      totalLines,
      totalQtyPlanned,
      totalQtyReceived,
      overUnderFlag
    }
  }, [linesWithCalculatedQty])

  // Validation checks
  const validationResults = useMemo(() => {
    const results = []
    
    // Check if status is Receiving
    if (receipt.status !== 'Receiving') {
      results.push({
        type: 'error' as const,
        message: t.statusNotReceiving
      })
    }
    
    // Check if has actual records
    const hasActualRecords = linesWithCalculatedQty.some(line => 
      line.actual_records && line.actual_records.length > 0
    )
    
    if (!hasActualRecords) {
      results.push({
        type: 'error' as const,
        message: t.noActualRecords
      })
    } else {
      results.push({
        type: 'success' as const,
        message: t.hasActualRecords
      })
    }
    
    // All validations passed
    if (results.every(r => r.type === 'success')) {
      results.push({
        type: 'success' as const,
        message: t.validationPassed
      })
    }
    
    return results
  }, [receipt.status, linesWithCalculatedQty, t])

  const canSubmit = validationResults.every(r => r.type === 'success')

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')
  }

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'vn' ? 'vi-VN' : 'en-US')
  }

  const getPartnerOrSource = () => {
    if (receipt.receipt_type === 'Transfer') {
      return receipt.from_wh_name || '-'
    } else if (receipt.receipt_type === 'PO' || receipt.receipt_type === 'Return') {
      return receipt.partner_name || '-'
    }
    return '-'
  }

  const handleSubmit = () => {
    // Calculate summary before submission
    const updatedLines = linesWithCalculatedQty.map(line => ({
      ...line,
      qty_received: line.qty_received || 0,
      qty_remaining: line.qty_remaining || 0
    }))

    // In real app, this would call an API
    const updatedReceipt = {
      ...receipt,
      status: 'Submitted' as const,
      submitted_at: new Date().toISOString(),
      submitted_by: 'current_user', // In real app, get from auth context
      submit_note: submitNote.trim() || undefined,
      total_lines: summary.totalLines,
      total_qty_planned: summary.totalQtyPlanned,
      total_qty_received: summary.totalQtyReceived,
      over_under_flag: summary.overUnderFlag,
      lines: updatedLines,
      updated_at: new Date().toISOString(),
      updated_by: 'current_user'
    }
    
    // Update the mock data (in real app, this would be an API call)
    const receiptIndex = mockGoodsReceipts.findIndex(r => r.id === receiptId)
    if (receiptIndex !== -1) {
      mockGoodsReceipts[receiptIndex] = updatedReceipt
    }
    
    toast.success(
      language === 'vn' 
        ? `Phiếu ${receipt.receipt_no} đã được gửi chờ duyệt thành công` 
        : `Receipt ${receipt.receipt_no} submitted for approval successfully`
    )
    
    setShowConfirmDialog(false)
    onBack()
  }

  const renderTrackingDetails = (line: GoodsReceiptLine) => {
    if (!line.actual_records || line.actual_records.length === 0) {
      return <div className="text-sm text-muted-foreground">No receiving records</div>
    }

    return (
      <div className="space-y-2">
        {line.tracking_type === 'Serial' && (
          <div>
            <h4 className="font-medium mb-2">{t.serialDetails}</h4>
            <div className="space-y-1">
              {line.actual_records.map((record, index) => (
                <div key={index} className="text-sm bg-muted p-2 rounded">
                  <div><strong>{t.barcode}:</strong> {record.barcode}</div>
                  <div><strong>{t.binLocation}:</strong> {record.bin_code} - {record.bin_name}</div>
                  <div><strong>{t.receivedAt}:</strong> {formatDateTime(record.received_at)}</div>
                  <div><strong>{t.receivedBy}:</strong> {record.received_by}</div>
                  {record.notes && <div><strong>{t.notes}:</strong> {record.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {line.tracking_type === 'Lot' && (
          <div>
            <h4 className="font-medium mb-2">{t.lotDetails}</h4>
            <div className="space-y-1">
              {line.actual_records.map((record, index) => (
                <div key={index} className="text-sm bg-muted p-2 rounded">
                  <div><strong>{t.lotNo}:</strong> {record.lot_no}</div>
                  <div><strong>{t.quantity}:</strong> {record.qty_actual}</div>
                  {record.mfg_date && <div><strong>{t.mfgDate}:</strong> {formatDate(record.mfg_date)}</div>}
                  {record.exp_date && <div><strong>{t.expDate}:</strong> {formatDate(record.exp_date)}</div>}
                  <div><strong>{t.binLocation}:</strong> {record.bin_code} - {record.bin_name}</div>
                  <div><strong>{t.receivedAt}:</strong> {formatDateTime(record.received_at)}</div>
                  <div><strong>{t.receivedBy}:</strong> {record.received_by}</div>
                  {record.notes && <div><strong>{t.notes}:</strong> {record.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {line.tracking_type === 'None' && (
          <div>
            <h4 className="font-medium mb-2">{t.noneDetails}</h4>
            <div className="space-y-1">
              {line.actual_records.map((record, index) => (
                <div key={index} className="text-sm bg-muted p-2 rounded">
                  <div><strong>{t.quantity}:</strong> {record.qty_actual}</div>
                  <div><strong>{t.binLocation}:</strong> {record.bin_code} - {record.bin_name}</div>
                  <div><strong>{t.receivedAt}:</strong> {formatDateTime(record.received_at)}</div>
                  <div><strong>{t.receivedBy}:</strong> {record.received_by}</div>
                  {record.notes && <div><strong>{t.notes}:</strong> {record.notes}</div>}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          {t.backToList}
        </Button>
        <div>
          <h1>{t.title}</h1>
          <p className="text-muted-foreground">{receipt.receipt_no}</p>
        </div>
      </div>

      {/* Receipt Information */}
      <Card>
        <CardHeader>
          <CardTitle>{t.receiptHeader}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <Label>{t.receiptNo}</Label>
              <p className="font-mono">{receipt.receipt_no}</p>
            </div>
            <div>
              <Label>{t.receiptType}</Label>
              <Badge variant="outline">{t[receipt.receipt_type as keyof typeof t]}</Badge>
            </div>
            {receipt.ref_no && (
              <div>
                <Label>{t.reference}</Label>
                <p>{receipt.ref_no}</p>
              </div>
            )}
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
              <p>{formatDate(receipt.expected_date)}</p>
            </div>
            <div>
              <Label>{t.status}</Label>
              <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {t[receipt.status as keyof typeof t]}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t.receiptSummary}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-muted rounded-lg">
              <Package className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
              <p className="text-2xl font-bold">{summary.totalLines}</p>
              <p className="text-sm text-muted-foreground">{t.totalLines}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{summary.totalQtyPlanned}</p>
              <p className="text-sm text-muted-foreground">{t.totalPlanned}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <p className="text-2xl font-bold">{summary.totalQtyReceived}</p>
              <p className="text-sm text-muted-foreground">{t.totalReceived}</p>
            </div>
            <div className="text-center p-4 bg-muted rounded-lg">
              <Badge className={statusColors[summary.overUnderFlag]}>
                {t[summary.overUnderFlag as keyof typeof t]}
              </Badge>
              <p className="text-sm text-muted-foreground mt-2">{t.overUnderFlag}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Line Details */}
      <Card>
        <CardHeader>
          <CardTitle>{t.lineDetails}</CardTitle>
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
                  <TableHead className="w-[100px]">Details</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {linesWithCalculatedQty.map((line) => (
                  <TableRow key={line.id}>
                    <TableCell className="font-mono">{line.model_code}</TableCell>
                    <TableCell>{line.model_name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {line.tracking_type === 'Serial' && t.serialTracking}
                        {line.tracking_type === 'Lot' && t.lotTracking}
                        {line.tracking_type === 'None' && t.noTracking}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{line.qty_planned}</TableCell>
                    <TableCell className="text-right font-medium">
                      {line.qty_received || 0}
                    </TableCell>
                    <TableCell className="text-right">
                      <span className={line.qty_remaining === 0 ? 'text-green-600' : 'text-orange-600'}>
                        {line.qty_remaining || 0}
                      </span>
                    </TableCell>
                    <TableCell>{line.line_bin || '-'}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedLine(selectedLine?.id === line.id ? null : line)}
                      >
                        {selectedLine?.id === line.id ? 'Hide' : 'View'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tracking Details */}
          {selectedLine && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle>{t.trackingDetails} - {selectedLine.model_name}</CardTitle>
              </CardHeader>
              <CardContent>
                {renderTrackingDetails(selectedLine)}
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>

      {/* Warnings & Validations */}
      <Card>
        <CardHeader>
          <CardTitle>{t.warnings}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {validationResults.map((result, index) => (
              <Alert key={index} className={result.type === 'error' ? 'border-red-200' : 'border-green-200'}>
                {result.type === 'error' ? (
                  <AlertCircle className="h-4 w-4 text-red-600" />
                ) : (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                )}
                <AlertDescription className={result.type === 'error' ? 'text-red-700' : 'text-green-700'}>
                  {result.message}
                </AlertDescription>
              </Alert>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Submit Section */}
      <Card>
        <CardHeader>
          <CardTitle>{t.submitSection}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="submitNote">{t.submitNote}</Label>
              <Textarea
                id="submitNote"
                value={submitNote}
                onChange={(e) => setSubmitNote(e.target.value)}
                placeholder={t.submitNotePlaceholder}
                rows={3}
              />
            </div>
            
            <Button
              onClick={() => setShowConfirmDialog(true)}
              disabled={!canSubmit}
              className="w-full"
            >
              <Send className="w-4 h-4 mr-2" />
              {t.submitButton}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Confirmation Dialog */}
      <AlertDialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmSubmit}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.confirmSubmitDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowConfirmDialog(false)}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleSubmit}>
              {t.submit}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}