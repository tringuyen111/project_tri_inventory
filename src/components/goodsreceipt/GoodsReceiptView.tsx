import { useState } from 'react'
import { ArrowLeft, Eye, AlertTriangle, Info, Clock, CheckCircle2, Package, Calendar, User, FileText, MapPin, Hash, Building } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { Separator } from '../ui/separator'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockGoodsReceipts, mockWarnings } from '../../data/mockGoodsReceiptData'
import { GoodsReceipt, GoodsReceiptLine, GoodsReceiptActualRecord } from '../../types/goodsReceipt'

const translations = {
  en: {
    // Navigation
    backToList: 'Back to Goods Receipt List',
    viewReceipt: 'View Goods Receipt',
    
    // Header
    receiptDetails: 'Receipt Details',
    basicInfo: 'Basic Information',
    receiptNo: 'Receipt No.',
    receiptType: 'Receipt Type',
    reference: 'Reference',
    partner: 'Partner',
    sourceWarehouse: 'Source Warehouse',
    destinationWarehouse: 'Destination Warehouse',
    expectedDate: 'Expected Date',
    status: 'Status',
    remarks: 'Remarks',
    
    // Lines
    receiptLines: 'Receipt Lines',
    assetModel: 'Asset Model',
    unitOfMeasure: 'Unit of Measure',
    trackingType: 'Tracking Type',
    plannedQty: 'Planned Qty',
    receivedQty: 'Received Qty',
    remainingQty: 'Remaining Qty',
    lineNote: 'Line Note',
    actions: 'Actions',
    
    // Line details dialog
    lineDetails: 'Line Details',
    lineDetailsDescription: 'View detailed information about this receipt line including actual records, tracking details, and warnings.',
    actualRecords: 'Actual Records',
    qty: 'Qty',
    serialNo: 'Serial No.',
    lotNo: 'Lot No.',
    mfgDate: 'Mfg Date',
    expDate: 'Exp Date',
    binLocation: 'Bin Location',
    receivedAt: 'Received At',
    receivedBy: 'Received By',
    notes: 'Notes',
    noActualRecords: 'No actual records yet',
    
    // Warnings dialog
    lineWarnings: 'Line Warnings',
    lineWarningsDescription: 'View warnings and issues related to this receipt line.',
    warningType: 'Warning Type',
    message: 'Message',
    blocking: 'Blocking',
    noWarnings: 'No warnings for this line',
    
    // Status info
    statusInfo: 'Status Information',
    createdAt: 'Created At',
    createdBy: 'Created By',
    updatedAt: 'Updated At',
    updatedBy: 'Updated By',
    submittedAt: 'Submitted At',
    submittedBy: 'Submitted By',
    approvedAt: 'Approved At',
    approvedBy: 'Approved By',
    completedAt: 'Completed At',
    completedBy: 'Completed By',
    submitNote: 'Submit Note',
    approvalNote: 'Approval Note',
    
    // Summary
    summary: 'Summary',
    totalLines: 'Total Lines',
    totalPlannedQty: 'Total Planned Qty',
    totalReceivedQty: 'Total Received Qty',
    receiptStatus: 'Receipt Status',
    exactMatch: 'Exact Match',
    overReceipt: 'Over Receipt',
    underReceipt: 'Under Receipt',
    
    // Types
    PO: 'Purchase Order',
    Transfer: 'Transfer',
    Return: 'Return',
    Manual: 'Manual Entry',
    
    // Tracking types
    None: 'None',
    Lot: 'Lot/Batch',
    Serial: 'Serial Number',
    
    // Status
    Draft: 'Draft',
    Receiving: 'Receiving',
    Submitted: 'Submitted',
    Completed: 'Completed',
    Rejected: 'Rejected',
    
    // Warning types
    under_receipt: 'Under Receipt',
    over_receipt: 'Over Receipt',
    quality_issue: 'Quality Issue',
    expiry_warning: 'Expiry Warning',
    
    // Actions
    viewLineDetails: 'View Line Details',
    close: 'Close',
    yes: 'Yes',
    no: 'No'
  },
  vi: {
    // Navigation
    backToList: 'Quay Lại Danh Sách Phiếu Nhập',
    viewReceipt: 'Xem Phiếu Nhập Kho',
    
    // Header
    receiptDetails: 'Chi Tiết Phiếu Nhập',
    basicInfo: 'Thông Tin Cơ Bản',
    receiptNo: 'Số Phiếu',
    receiptType: 'Loại Phiếu',
    reference: 'Tham Chiếu',
    partner: 'Đối Tác',
    sourceWarehouse: 'Kho Nguồn',
    destinationWarehouse: 'Kho Đích',
    expectedDate: 'Ngày Dự Kiến',
    status: 'Trạng Thái',
    remarks: 'Ghi Chú',
    
    // Lines
    receiptLines: 'Chi Tiết Phiếu',
    assetModel: 'Mẫu Tài Sản',
    unitOfMeasure: 'Đơn Vị Tính',
    trackingType: 'Loại Theo Dõi',
    plannedQty: 'SL Dự Kiến',
    receivedQty: 'SL Đã Nhận',
    remainingQty: 'SL Còn Lại',
    lineNote: 'Ghi Chú Dòng',
    actions: 'Thao Tác',
    
    // Line details dialog
    lineDetails: 'Chi Tiết Dòng',
    lineDetailsDescription: 'Xem thông tin chi tiết về dòng phiếu nhập này bao gồm bản ghi thực tế, chi tiết theo dõi và cảnh báo.',
    actualRecords: 'Bản Ghi Thực Tế',
    qty: 'SL',
    serialNo: 'Số Serial',
    lotNo: 'Số Lô',
    mfgDate: 'Ngày SX',
    expDate: 'Ngày HH',
    binLocation: 'Vị Trí Bin',
    receivedAt: 'Thời Gian Nhận',
    receivedBy: 'Người Nhận',
    notes: 'Ghi Chú',
    noActualRecords: 'Chưa có bản ghi thực tế',
    
    // Warnings dialog
    lineWarnings: 'Cảnh Báo Dòng',
    lineWarningsDescription: 'Xem cảnh báo và vấn đề liên quan đến dòng phiếu nhập này.',
    warningType: 'Loại Cảnh Báo',
    message: 'Thông Báo',
    blocking: 'Chặn',
    noWarnings: 'Không có cảnh báo cho dòng này',
    
    // Status info
    statusInfo: 'Thông Tin Trạng Thái',
    createdAt: 'Tạo Lúc',
    createdBy: 'Tạo Bởi',
    updatedAt: 'Cập Nhật Lúc',
    updatedBy: 'Cập Nhật Bởi',
    submittedAt: 'Gửi Lúc',
    submittedBy: 'Gửi Bởi',
    approvedAt: 'Duyệt Lúc',
    approvedBy: 'Duyệt Bởi',
    completedAt: 'Hoàn Thành Lúc',
    completedBy: 'Hoàn Thành Bởi',
    submitNote: 'Ghi Chú Gửi',
    approvalNote: 'Ghi Chú Duyệt',
    
    // Summary
    summary: 'Tóm Tắt',
    totalLines: 'Tổng Số Dòng',
    totalPlannedQty: 'Tổng SL Dự Kiến',
    totalReceivedQty: 'Tổng SL Đã Nhận',
    receiptStatus: 'Trạng Thái Nhận',
    exactMatch: 'Khớp Chính Xác',
    overReceipt: 'Nhận Thừa',
    underReceipt: 'Nhận Thiếu',
    
    // Types
    PO: 'Đơn Mua Hàng',
    Transfer: 'Chuyển Kho',
    Return: 'Trả Hàng',
    Manual: 'Nhập Thủ Công',
    
    // Tracking types
    None: 'Không',
    Lot: 'Lô/Batch',
    Serial: 'Số Serial',
    
    // Status
    Draft: 'Nháp',
    Receiving: 'Đang Nhận',
    Submitted: 'Đã Gửi',
    Completed: 'Hoàn Thành',
    Rejected: 'Từ Chối',
    
    // Warning types
    under_receipt: 'Nhận Thiếu',
    over_receipt: 'Nhận Thừa',
    quality_issue: 'Vấn Đề Chất Lượng',
    expiry_warning: 'Cảnh Báo Hết Hạn',
    
    // Actions
    viewLineDetails: 'Xem Chi Tiết Dòng',
    close: 'Đóng',
    yes: 'Có',
    no: 'Không'
  }
}

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Receiving: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

interface GoodsReceiptViewProps {
  receiptId?: string
}

export function GoodsReceiptView({ receiptId }: GoodsReceiptViewProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  // Get receipt data
  const receipt = (() => {
    const id = receiptId || localStorage.getItem('viewingReceiptId')
    return id ? mockGoodsReceipts.find(r => r.id === id) || null : null
  })()
  
  if (!receipt) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={() => window.location.hash = '#warehouse/goods-receipt'}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            {t.backToList}
          </Button>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">Receipt not found</p>
        </div>
      </div>
    )
  }

  const handleBackToList = () => {
    localStorage.removeItem('viewingReceiptId')
    window.location.hash = '#warehouse/goods-receipt'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString(language === 'vi' ? 'vi-VN' : 'en-US')
  }

  const formatDateOnly = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')
  }

  const getPartnerOrSource = () => {
    if (receipt.receipt_type === 'Transfer') {
      return receipt.from_wh_name || '-'
    } else if (receipt.receipt_type === 'PO' || receipt.receipt_type === 'Return') {
      return receipt.partner_name || '-'
    }
    return '-'
  }

  const getLineWarnings = (lineId: string) => {
    return mockWarnings.filter(w => w.line_id === lineId)
  }

  const hasLineWarnings = (lineId: string) => {
    return getLineWarnings(lineId).length > 0
  }

  const LineDetailsDialog = ({ line }: { line: GoodsReceiptLine }) => {
    const warnings = getLineWarnings(line.id)
    
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t.lineDetails} - {line.model_name}</DialogTitle>
            <DialogDescription>
              {t.lineDetailsDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Line Basic Info */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">{t.assetModel}</p>
                <p>{line.model_code} - {line.model_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.unitOfMeasure}</p>
                <p>{line.uom_code} - {line.uom_name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.trackingType}</p>
                <Badge variant="outline">{t[line.tracking_type as keyof typeof t]}</Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">{t.plannedQty}</p>
                <p>{line.qty_planned}</p>
              </div>
              {line.qty_received !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.receivedQty}</p>
                  <p>{line.qty_received}</p>
                </div>
              )}
              {line.qty_remaining !== undefined && (
                <div>
                  <p className="text-sm text-muted-foreground">{t.remainingQty}</p>
                  <p>{line.qty_remaining}</p>
                </div>
              )}
            </div>

            {line.note && (
              <div>
                <p className="text-sm text-muted-foreground">{t.lineNote}</p>
                <p>{line.note}</p>
              </div>
            )}

            <Separator />

            {/* Actual Records */}
            <div>
              <h4 className="mb-4">{t.actualRecords}</h4>
              {line.actual_records && line.actual_records.length > 0 ? (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t.qty}</TableHead>
                        {line.tracking_type === 'Serial' && <TableHead>{t.serialNo}</TableHead>}
                        {line.tracking_type === 'Lot' && (
                          <>
                            <TableHead>{t.lotNo}</TableHead>
                            <TableHead>{t.mfgDate}</TableHead>
                            <TableHead>{t.expDate}</TableHead>
                          </>
                        )}
                        <TableHead>{t.binLocation}</TableHead>
                        <TableHead>{t.receivedAt}</TableHead>
                        <TableHead>{t.receivedBy}</TableHead>
                        <TableHead>{t.notes}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {line.actual_records.map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{record.qty_actual}</TableCell>
                          {line.tracking_type === 'Serial' && (
                            <TableCell className="font-mono text-sm">{record.serial_no || '-'}</TableCell>
                          )}
                          {line.tracking_type === 'Lot' && (
                            <>
                              <TableCell className="font-mono text-sm">{record.lot_no || '-'}</TableCell>
                              <TableCell>{record.mfg_date ? formatDateOnly(record.mfg_date) : '-'}</TableCell>
                              <TableCell>{record.exp_date ? formatDateOnly(record.exp_date) : '-'}</TableCell>
                            </>
                          )}
                          <TableCell>
                            <div>
                              <p className="font-mono text-sm">{record.bin_code}</p>
                              <p className="text-xs text-muted-foreground">{record.bin_name}</p>
                            </div>
                          </TableCell>
                          <TableCell>{formatDate(record.received_at)}</TableCell>
                          <TableCell>{record.received_by}</TableCell>
                          <TableCell>{record.notes || '-'}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p className="text-muted-foreground text-center py-4">{t.noActualRecords}</p>
              )}
            </div>

            {/* Warnings */}
            {warnings.length > 0 && (
              <>
                <Separator />
                <div>
                  <h4 className="mb-4">{t.lineWarnings}</h4>
                  <div className="space-y-2">
                    {warnings.map((warning, index) => (
                      <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                        <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-sm font-medium">{t[warning.type as keyof typeof t]}</p>
                          <p className="text-sm text-muted-foreground">{warning.message}</p>
                          {warning.blocking && (
                            <Badge variant="destructive" className="mt-1">Blocking</Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  const WarningIcon = ({ lineId }: { lineId: string }) => {
    const warnings = getLineWarnings(lineId)
    
    if (warnings.length === 0) return null

    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <AlertTriangle className="w-4 h-4 text-yellow-600" />
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{t.lineWarnings}</DialogTitle>
            <DialogDescription>
              {t.lineWarningsDescription}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-3">
            {warnings.map((warning, index) => (
              <div key={index} className="flex items-start gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-md">
                <AlertTriangle className="w-4 h-4 text-yellow-600 mt-0.5" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{t[warning.type as keyof typeof t]}</p>
                  <p className="text-sm text-muted-foreground">{warning.message}</p>
                  <div className="mt-1">
                    <span className="text-xs text-muted-foreground">{t.blocking}: </span>
                    <Badge variant={warning.blocking ? "destructive" : "secondary"} className="text-xs">
                      {warning.blocking ? t.yes : t.no}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  // Calculate summary
  const totalPlannedQty = receipt.lines?.reduce((sum, line) => sum + line.qty_planned, 0) || 0
  const totalReceivedQty = receipt.lines?.reduce((sum, line) => sum + (line.qty_received || 0), 0) || 0
  
  let receiptStatusFlag = 'exactMatch'
  if (totalReceivedQty > totalPlannedQty) {
    receiptStatusFlag = 'overReceipt'
  } else if (totalReceivedQty < totalPlannedQty && receipt.status !== 'Draft') {
    receiptStatusFlag = 'underReceipt'
  }

  return (
    <div className="space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={handleBackToList}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          {t.backToList}
        </Button>
        <div>
          <h1>{t.viewReceipt}</h1>
          <p className="text-muted-foreground font-mono">{receipt.receipt_no}</p>
        </div>
      </div>

      {/* Basic Information */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Info className="w-5 h-5" />
              {t.basicInfo}
            </CardTitle>
            <Badge className={statusColors[receipt.status]}>
              {t[receipt.status as keyof typeof t]}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.receiptNo}</p>
              </div>
              <p className="font-mono">{receipt.receipt_no}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.receiptType}</p>
              </div>
              <Badge variant="outline">{t[receipt.receipt_type as keyof typeof t]}</Badge>
            </div>

            {receipt.ref_no && (
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t.reference}</p>
                </div>
                <p>{receipt.ref_no}</p>
              </div>
            )}

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">
                  {receipt.receipt_type === 'Transfer' ? t.sourceWarehouse : t.partner}
                </p>
              </div>
              <p>{getPartnerOrSource()}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.destinationWarehouse}</p>
              </div>
              <p>{receipt.to_wh_name}</p>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t.expectedDate}</p>
              </div>
              <p>{formatDateOnly(receipt.expected_date)}</p>
            </div>
          </div>

          {receipt.remark && (
            <div className="mt-6 space-y-1">
              <p className="text-sm text-muted-foreground">{t.remarks}</p>
              <p className="p-3 bg-muted rounded-md">{receipt.remark}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {t.summary}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold">{receipt.lines?.length || 0}</p>
              <p className="text-sm text-muted-foreground">{t.totalLines}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalPlannedQty}</p>
              <p className="text-sm text-muted-foreground">{t.totalPlannedQty}</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{totalReceivedQty}</p>
              <p className="text-sm text-muted-foreground">{t.totalReceivedQty}</p>
            </div>
            <div className="text-center">
              <Badge 
                variant={receiptStatusFlag === 'exactMatch' ? 'default' : receiptStatusFlag === 'overReceipt' ? 'destructive' : 'secondary'}
                className="text-sm"
              >
                {t[receiptStatusFlag as keyof typeof t]}
              </Badge>
              <p className="text-sm text-muted-foreground mt-1">{t.receiptStatus}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Receipt Lines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            {t.receiptLines}
            <Badge variant="secondary">{receipt.lines?.length || 0} lines</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {receipt.lines && receipt.lines.length > 0 ? (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t.assetModel}</TableHead>
                    <TableHead>{t.unitOfMeasure}</TableHead>
                    <TableHead>{t.trackingType}</TableHead>
                    <TableHead className="text-right">{t.plannedQty}</TableHead>
                    {receipt.status !== 'Draft' && (
                      <>
                        <TableHead className="text-right">{t.receivedQty}</TableHead>
                        <TableHead className="text-right">{t.remainingQty}</TableHead>
                      </>
                    )}
                    <TableHead>{t.lineNote}</TableHead>
                    <TableHead className="w-[100px]">{t.actions}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {receipt.lines.map((line) => (
                    <TableRow key={line.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{line.model_name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{line.model_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div>
                          <p>{line.uom_name}</p>
                          <p className="text-sm text-muted-foreground font-mono">{line.uom_code}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{t[line.tracking_type as keyof typeof t]}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{line.qty_planned}</TableCell>
                      {receipt.status !== 'Draft' && (
                        <>
                          <TableCell className="text-right">
                            {line.qty_received !== undefined ? line.qty_received : '-'}
                          </TableCell>
                          <TableCell className="text-right">
                            {line.qty_remaining !== undefined ? line.qty_remaining : '-'}
                          </TableCell>
                        </>
                      )}
                      <TableCell>
                        <p className="text-sm">{line.note || '-'}</p>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <LineDetailsDialog line={line} />
                          <WarningIcon lineId={line.id} />
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No lines found</p>
          )}
        </CardContent>
      </Card>

      {/* Status Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            {t.statusInfo}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t.createdBy}</p>
                </div>
                <p>{receipt.created_by}</p>
                <p className="text-xs text-muted-foreground">{formatDate(receipt.created_at)}</p>
              </div>

              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">{t.updatedBy}</p>
                </div>
                <p>{receipt.updated_by}</p>
                <p className="text-xs text-muted-foreground">{formatDate(receipt.updated_at)}</p>
              </div>
            </div>

            {receipt.submitted_at && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">{t.submittedBy}</p>
                    </div>
                    <p>{receipt.submitted_by}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(receipt.submitted_at)}</p>
                  </div>
                  {receipt.submit_note && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t.submitNote}</p>
                      <p className="p-2 bg-muted rounded text-sm">{receipt.submit_note}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {receipt.approved_at && (
              <>
                <Separator />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-600" />
                      <p className="text-sm text-muted-foreground">{t.approvedBy}</p>
                    </div>
                    <p>{receipt.approved_by}</p>
                    <p className="text-xs text-muted-foreground">{formatDate(receipt.approved_at)}</p>
                  </div>
                  {receipt.approval_note && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">{t.approvalNote}</p>
                      <p className="p-2 bg-muted rounded text-sm">{receipt.approval_note}</p>
                    </div>
                  )}
                </div>
              </>
            )}

            {receipt.completed_at && (
              <>
                <Separator />
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600" />
                    <p className="text-sm text-muted-foreground">{t.completedBy}</p>
                  </div>
                  <p>{receipt.completed_by}</p>
                  <p className="text-xs text-muted-foreground">{formatDate(receipt.completed_at)}</p>
                </div>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}