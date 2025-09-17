import { useState, useEffect } from 'react'
import { ArrowLeft, Clock, Package, MapPin, User, Calendar, FileText, CheckCircle, AlertCircle, Truck, Eye } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { GoodsReceipt } from '../../types/goodsReceipt'
import { mockGoodsReceipts, mockAuditLogs } from '../../data/mockGoodsReceiptData'
import { getWarehouseByCode } from '../../data/mockWarehouseData'

const translations = {
  en: {
    goodsReceiptDetail: 'Goods Receipt Detail',
    goodsReceiptInformation: 'Goods Receipt Information',
    logisticsDetails: 'Logistics Details',
    activityTimeline: 'Activity Timeline',
    goodsReceiptNo: 'Goods Receipt No',
    goodsReceiptType: 'Goods Receipt Type',
    relatedEntry: 'Related Entry',
    createdBy: 'Created By',
    createdDate: 'Created Date',
    handler: 'Handler',
    warehouse: 'Warehouse',
    address: 'Address',
    status: 'Status',
    approvedBy: 'Approved By',
    approvalDate: 'Approval Date',
    note: 'Note',
    receivingWarehouse: 'Receiving Warehouse',
    modelCode: 'Model Code',
    modelName: 'Model Name',
    tracking: 'Tracking',
    qtyPlanned: 'Qty Planned',
    qtyReceived: 'Qty Received',
    unit: 'Unit',
    location: 'Location',
    lotSerial: 'Lot/Serial',
    totalLines: 'Total Lines',
    totalPlanned: 'Total Planned',
    totalReceived: 'Total Received',
    backToList: 'Back to Goods Receipt',
    viewDetail: 'View Detail',
    trackingDetails: 'Tracking Details',
    serialNumber: 'Serial Number',
    lotBatch: 'Lot/Batch',
    quantity: 'Quantity',
    serialNo: 'Serial No.',
    // Timeline activities
    grCreated: 'GR Created',
    receiving: 'Receiving',
    submitRequest: 'Submit Request for Approval',
    completed: 'Completed',
    // Status badges
    Draft: 'Draft',
    Receiving: 'Receiving',
    Submitted: 'Submitted',
    Completed: 'Completed',
    Approved: 'Approved',
    noItemsFound: 'No items found'
  },
  vi: {
    goodsReceiptDetail: 'Chi Tiết Phiếu Nhập Kho',
    goodsReceiptInformation: 'Thông Tin Phiếu Nhập Kho',
    logisticsDetails: 'Chi Tiết Logistics',
    activityTimeline: 'Lịch Sử Hoạt Động',
    goodsReceiptNo: 'Số Phiếu Nhập Kho',
    goodsReceiptType: 'Loại Phiếu Nhập Kho',
    relatedEntry: 'Liên Quan Đến',
    createdBy: 'Tạo Bởi',
    createdDate: 'Ngày Tạo',
    handler: 'Người Xử Lý',
    warehouse: 'Kho',
    address: 'Địa Chỉ',
    status: 'Trạng Thái',
    approvedBy: 'Phê Duyệt Bởi',
    approvalDate: 'Ngày Phê Duyệt',
    note: 'Ghi Chú',
    receivingWarehouse: 'Kho Nhận Hàng',
    modelCode: 'Mã Model',
    modelName: 'Tên Model',
    tracking: 'Truy Xuất',
    qtyPlanned: 'SL Dự Kiến',
    qtyReceived: 'SL Nhận',
    unit: 'Đơn Vị',
    location: 'Vị Trí',
    lotSerial: 'Lot/Serial',
    totalLines: 'Tổng Dòng',
    totalPlanned: 'Tổng Dự Kiến',
    totalReceived: 'Tổng Nhận',
    backToList: 'Quay Lại Danh Sách',
    viewDetail: 'Xem Chi Tiết',
    trackingDetails: 'Chi Tiết Truy Xuất',
    serialNumber: 'Số Serial',
    lotBatch: 'Lot/Batch',
    quantity: 'Số Lượng',
    serialNo: 'Số Serial',
    // Timeline activities
    grCreated: 'Tạo Phiếu Nhập',
    receiving: 'Đang Nhận Hàng',
    submitRequest: 'Gửi Yêu Cầu Phê Duyệt',
    completed: 'Hoàn Thành',
    // Status badges
    Draft: 'Nháp',
    Receiving: 'Đang Nhận',
    Submitted: 'Đã Gửi',
    Completed: 'Hoàn Thành',
    Approved: 'Đã Duyệt',
    noItemsFound: 'Không tìm thấy mục nào'
  }
}

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Receiving: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
}

interface TimelineItem {
  id: string
  title: string
  description: string
  timestamp: string
  status: 'completed' | 'current' | 'pending'
  icon: React.ComponentType<{ className?: string }>
}

interface GoodsReceiptDetailProps {
  receiptId?: string
}

export function GoodsReceiptDetail({ receiptId }: GoodsReceiptDetailProps) {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [receipt, setReceipt] = useState<GoodsReceipt | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedLine, setSelectedLine] = useState<any>(null)
  const [trackingDialogOpen, setTrackingDialogOpen] = useState(false)

  useEffect(() => {
    // Simulate loading receipt data
    const timer = setTimeout(() => {
      if (receiptId) {
        const foundReceipt = mockGoodsReceipts.find(r => r.id === receiptId)
        setReceipt(foundReceipt || null)
      }
      setLoading(false)
    }, 500)
    
    return () => clearTimeout(timer)
  }, [receiptId])

  const handleBack = () => {
    window.location.hash = '#warehouse/goods-receipt'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!receipt) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">Receipt not found</p>
        <Button onClick={handleBack} className="mt-4">
          {t.backToList}
        </Button>
      </div>
    )
  }

  // Get timeline items based on receipt status
  const getTimelineItems = (): TimelineItem[] => {
    const auditLogs = mockAuditLogs.filter(log => log.receipt_id === receipt.id)
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())

    const items: TimelineItem[] = []

    // Always show creation
    const createdLog = auditLogs.find(log => log.action === 'created')
    if (createdLog) {
      items.push({
        id: '1',
        title: t.grCreated,
        description: `${createdLog.details}`,
        timestamp: new Date(createdLog.timestamp).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US'),
        status: 'completed',
        icon: FileText
      })
    } else {
      items.push({
        id: '1',
        title: t.grCreated,
        description: `Goods Receipt created by ${receipt.created_by}`,
        timestamp: new Date(receipt.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US'),
        status: 'completed',
        icon: FileText
      })
    }

    // Show receiving status
    if (receipt.status === 'Receiving' || receipt.status === 'Submitted' || receipt.status === 'Completed') {
      const receivingLog = auditLogs.find(log => log.action === 'updated' && log.details.includes('Receiving'))
      items.push({
        id: '2',
        title: t.receiving,
        description: receivingLog ? receivingLog.details : `Receiving by ${receipt.updated_by}`,
        timestamp: receivingLog ? 
          new Date(receivingLog.timestamp).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') :
          new Date(receipt.updated_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US'),
        status: receipt.status === 'Receiving' ? 'current' : 'completed',
        icon: Package
      })
    }

    // Show submitted status
    if (receipt.status === 'Submitted' || receipt.status === 'Completed') {
      const submittedLog = auditLogs.find(log => log.action === 'submitted')
      items.push({
        id: '3',
        title: t.submitRequest,
        description: submittedLog ? 
          submittedLog.details : 
          (receipt.submitted_by ? `Submit by ${receipt.submitted_by}` : 'Submit by System'),
        timestamp: submittedLog ? 
          new Date(submittedLog.timestamp).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') :
          (receipt.submitted_at ? new Date(receipt.submitted_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : ''),
        status: receipt.status === 'Submitted' ? 'current' : 'completed',
        icon: Clock
      })
    }

    // Show completed status
    if (receipt.status === 'Completed') {
      const approvedLog = auditLogs.find(log => log.action === 'approved')
      items.push({
        id: '4',
        title: t.completed,
        description: approvedLog ? 
          approvedLog.details : 
          (receipt.approved_by ? `Approved by ${receipt.approved_by}` : 'Approved by System'),
        timestamp: approvedLog ? 
          new Date(approvedLog.timestamp).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') :
          (receipt.completed_at ? new Date(receipt.completed_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : ''),
        status: 'completed',
        icon: CheckCircle
      })
    }

    return items
  }

  const timelineItems = getTimelineItems()
  const warehouseDetails = getWarehouseByCode(receipt.to_wh_code)

  // Generate mock tracking data for demo
  const generateTrackingData = (line: any) => {
    if (line.tracking_type === 'Lot') {
      return Array.from({ length: Math.min(line.qty_received || line.qty_planned, 3) }, (_, index) => ({
        stt: index + 1,
        lotBatch: `LOT${Date.now().toString().slice(-6)}-${String.fromCharCode(65 + index)}`,
        modelName: line.model_name,
        unit: line.uom_code,
        quantity: Math.ceil((line.qty_received || line.qty_planned) / 3)
      }))
    } else if (line.tracking_type === 'Serial') {
      return Array.from({ length: Math.min(line.qty_received || line.qty_planned, 5) }, (_, index) => ({
        stt: index + 1,
        serial: `SN${Date.now().toString().slice(-8)}${String.fromCharCode(65 + index)}`,
        modelName: line.model_name,
        unit: line.uom_code
      }))
    }
    return []
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {t.backToList}
          </Button>
          <div>
            <nav className="text-sm text-muted-foreground mb-1">
              Goods Receipt &gt; Goods Receipt Details
            </nav>
            <h1>{t.goodsReceiptDetail}</h1>
          </div>
        </div>
      </div>

      {/* Main Content - 2/3 + 1/3 Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left Column - Main Content (2/3) */}
        <div className="xl:col-span-2 space-y-6">
          {/* Goods Receipt Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="h-5 w-5" />
                {t.goodsReceiptInformation}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">{t.goodsReceiptNo}</label>
                    <p className="font-mono">{receipt.receipt_no}</p>
                  </div>
                  
                  <div>
                    <label className="text-sm text-muted-foreground">{t.goodsReceiptType}</label>
                    <p>{receipt.receipt_type}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.relatedEntry}</label>
                    <p>{receipt.ref_no || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.createdBy}</label>
                    <p>{receipt.created_by}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.createdDate}</label>
                    <p>{new Date(receipt.created_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US')}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.handler}</label>
                    <p>{receipt.updated_by}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="text-sm text-muted-foreground">{t.warehouse}</label>
                    <p>{receipt.to_wh_name}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.address}</label>
                    <p>{warehouseDetails?.address || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.status}</label>
                    <div className="mt-1">
                      <Badge className={statusColors[receipt.status]}>
                        {t[receipt.status as keyof typeof t]}
                      </Badge>
                    </div>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.approvedBy}</label>
                    <p>{receipt.approved_by || '-'}</p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.approvalDate}</label>
                    <p>
                      {receipt.approved_at ? new Date(receipt.approved_at).toLocaleDateString(language === 'vi' ? 'vi-VN' : 'en-US') : '-'}
                    </p>
                  </div>

                  <div>
                    <label className="text-sm text-muted-foreground">{t.note}</label>
                    <p>{receipt.remark || '-'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detail Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Goods Receipt Detail
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-medium">{t.modelCode}</TableHead>
                      <TableHead className="font-medium">{t.modelName}</TableHead>
                      <TableHead className="font-medium">{t.tracking}</TableHead>
                      <TableHead className="font-medium text-right">{t.qtyPlanned}</TableHead>
                      <TableHead className="font-medium text-right">{t.qtyReceived}</TableHead>
                      <TableHead className="font-medium text-center">{t.unit}</TableHead>
                      <TableHead className="font-medium text-center">{t.location}</TableHead>
                      <TableHead className="font-medium">{t.lotSerial}</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {receipt.lines && receipt.lines.length > 0 ? (
                      receipt.lines.map((line, index) => (
                        <TableRow key={line.id} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                          <TableCell className="font-mono">{line.model_code}</TableCell>
                          <TableCell>{line.model_name}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="text-xs">
                              {line.tracking_type}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right font-mono">{line.qty_planned.toLocaleString()}</TableCell>
                          <TableCell className="text-right font-mono">
                            {line.qty_received ? (
                              <span className={`${line.qty_received !== line.qty_planned ? 'text-orange-600 font-medium' : 'text-green-600'}`}>
                                {line.qty_received.toLocaleString()}
                              </span>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="outline" className="text-xs">
                              {line.uom_code}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-center">
                            <Badge variant="secondary" className="font-mono text-xs">
                              {line.line_bin || 'TBD'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            {line.tracking_type === 'None' ? (
                              <span className="text-muted-foreground">-</span>
                            ) : line.tracking_type === 'Lot' || line.tracking_type === 'Serial' ? (
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 px-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                                onClick={() => {
                                  setSelectedLine(line)
                                  setTrackingDialogOpen(true)
                                }}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                {t.viewDetail}
                              </Button>
                            ) : (
                              <span className="text-muted-foreground">Pending</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                          {t.noItemsFound}
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
              
              {/* Summary */}
              <div className="mt-6 flex flex-wrap justify-between items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="flex flex-wrap gap-6">
                  <span><strong>{t.totalLines}:</strong> {receipt.lines?.length || 0}</span>
                  <span><strong>{t.totalPlanned}:</strong> {receipt.lines?.reduce((sum, line) => sum + line.qty_planned, 0).toLocaleString() || 0}</span>
                  {receipt.lines?.some(line => line.qty_received) && (
                    <span><strong>{t.totalReceived}:</strong> 
                      <span className="ml-1 font-mono">
                        {receipt.lines?.reduce((sum, line) => sum + (line.qty_received || 0), 0).toLocaleString()}
                      </span>
                    </span>
                  )}
                </div>
                <Badge variant={receipt.status === 'Completed' ? 'default' : 'secondary'} className="text-sm">
                  {t[receipt.status as keyof typeof t]}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Activity Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                {t.activityTimeline}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {timelineItems.map((item, index) => {
                  const Icon = item.icon
                  return (
                    <div key={item.id} className="relative flex items-start gap-4">
                      <div className={`relative z-10 flex items-center justify-center w-10 h-10 rounded-full border-2 ${
                        item.status === 'completed' ? 'bg-green-100 border-green-200 dark:bg-green-900/20 dark:border-green-800' :
                        item.status === 'current' ? 'bg-blue-100 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800' :
                        'bg-gray-100 border-gray-200 dark:bg-gray-800 dark:border-gray-700'
                      }`}>
                        <Icon className={`w-5 h-5 ${
                          item.status === 'completed' ? 'text-green-600 dark:text-green-400' :
                          item.status === 'current' ? 'text-blue-600 dark:text-blue-400' :
                          'text-gray-400'
                        }`} />
                      </div>
                      
                      {index < timelineItems.length - 1 && (
                        <div className="absolute left-5 top-10 w-px h-6 bg-border"></div>
                      )}
                      
                      <div className="flex-1 min-w-0 pb-8">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium">{item.title}</p>
                          {item.status === 'current' && (
                            <Badge variant="outline" className="text-xs">Current</Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                        {item.timestamp && (
                          <p className="text-xs text-muted-foreground flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {item.timestamp}
                          </p>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>

          {/* Logistics Details */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Truck className="h-5 w-5" />
                {t.logisticsDetails}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
                </div>
                <div className="flex-1">
                  <p className="font-medium">{t.receivingWarehouse}</p>
                  <p className="text-sm text-muted-foreground">{receipt.to_wh_name}</p>
                  <p className="text-sm text-muted-foreground font-mono">{receipt.to_wh_code}</p>
                  {warehouseDetails?.address && (
                    <p className="text-sm text-muted-foreground mt-1">{warehouseDetails.address}</p>
                  )}
                </div>
              </div>
              
              <Separator />
              
              {warehouseDetails && (
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {warehouseDetails.branchName}, {warehouseDetails.organizationName}
                    </p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Tracking Details Dialog */}
      <Dialog open={trackingDialogOpen} onOpenChange={setTrackingDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {t.trackingDetails} - {selectedLine?.model_name}
            </DialogTitle>
          </DialogHeader>
          
          {selectedLine && (
            <div className="space-y-4">
              {/* Model Information */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-muted/30 rounded-lg">
                <div>
                  <label className="text-sm text-muted-foreground">{t.modelName}</label>
                  <p className="font-medium">{selectedLine.model_name}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">{t.unit}</label>
                  <p>{selectedLine.uom_code}</p>
                </div>
              </div>

              {/* Tracking Details Table */}
              <div className="rounded-lg border">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="w-16 text-center">STT</TableHead>
                      {selectedLine.tracking_type === 'Lot' && (
                        <>
                          <TableHead>{t.lotBatch}</TableHead>
                          <TableHead className="text-center">{t.quantity}</TableHead>
                        </>
                      )}
                      {selectedLine.tracking_type === 'Serial' && (
                        <TableHead>{t.serialNo}</TableHead>
                      )}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {generateTrackingData(selectedLine).map((item: any, index) => (
                      <TableRow key={index} className={index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}>
                        <TableCell className="text-center font-medium">{item.stt}</TableCell>
                        {selectedLine.tracking_type === 'Lot' && (
                          <>
                            <TableCell className="font-mono text-blue-600">{item.lotBatch}</TableCell>
                            <TableCell className="text-center font-mono">{item.quantity}</TableCell>
                          </>
                        )}
                        {selectedLine.tracking_type === 'Serial' && (
                          <TableCell className="font-mono text-blue-600">{item.serial}</TableCell>
                        )}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Summary */}
              <div className="flex justify-between items-center p-4 bg-muted/30 rounded-lg">
                <div className="flex gap-6">
                  <span><strong>{t.totalLines}:</strong> {generateTrackingData(selectedLine).length}</span>
                  {selectedLine.tracking_type === 'Lot' && (
                    <span><strong>{t.totalReceived}:</strong> {selectedLine.qty_received || selectedLine.qty_planned}</span>
                  )}
                </div>
                <Badge variant="secondary" className="text-sm">
                  {selectedLine.tracking_type}
                </Badge>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}