import { useState, useMemo } from 'react'
import { Plus, Search, Filter, FileDown, FileUp, Eye, Edit, Trash2, MoreHorizontal, CheckCircle2, Send, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'

import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog'
import { useLanguage } from '../../contexts/LanguageContext'

import { mockGoodsReceipts } from '../../data/mockGoodsReceiptData'
import { GoodsReceipt } from '../../types/goodsReceipt'
import { toast } from 'sonner@2.0.3'

const translations = {
  en: {
    title: 'Goods Receipt Management',
    description: 'Manage goods receipts, create new receipts, and track receiving status',
    create: 'Create Receipt', 
    search: 'Search receipts...',
    filter: 'Filter by Status',
    filterType: 'Filter by Type',
    filterDestination: 'Filter by Destination',
    filterSource: 'Filter by Source Warehouse',
    filterPartner: 'Filter by Partner',
    filterDate: 'Filter by Date Range',
    export: 'Export',
    import: 'Import',
    clearFilters: 'Clear Filters',
    allStatuses: 'All Statuses',
    allTypes: 'All Types',
    allWarehouses: 'All Warehouses',
    allPartners: 'All Partners',
    dateRange: 'Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    receiptNo: 'Receipt No',
    type: 'Type',
    reference: 'Reference',
    partner: 'Partner / Source',
    destination: 'Destination',
    expectedDate: 'Expected Date',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    approve: 'Approve',
    submitForApproval: 'Submit for Approval',
    delete: 'Delete',
    confirmDelete: 'Are you sure you want to delete this receipt?',
    deleteDescription: 'This action cannot be undone. This will permanently delete the goods receipt and all associated data.',
    cancel: 'Cancel',
    deleteReceipt: 'Delete Receipt',
    noResults: 'No goods receipts found',
    total: 'Total',
    receipts: 'receipts',
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
    Manual: 'Manual Entry'
  },
  vn: {
    title: 'Quản Lý Phiếu Nhập Kho',
    description: 'Quản lý phiếu nhập kho, tạo phiếu mới và theo dõi tình trạng nhập hàng',
    create: 'Tạo Phiếu',
    search: 'Tìm kiếm phiếu...',
    filter: 'Lọc theo Trạng Thái',
    filterType: 'Lọc theo Loại',
    filterDestination: 'Lọc theo Kho Đích',
    filterSource: 'Lọc theo Kho Nguồn',
    filterPartner: 'Lọc theo Đối Tác',
    filterDate: 'Lọc theo Khoảng Ngày',
    export: 'Xuất File',
    import: 'Nhập File',
    clearFilters: 'Xóa Lọc',
    allStatuses: 'Tất Cả Trạng Thái',
    allTypes: 'Tất Cả Loại',
    allWarehouses: 'Tất Cả Kho',
    allPartners: 'Tất Cả Đối Tác',
    dateRange: 'Khoảng Ngày',
    startDate: 'Ngày Bắt Đầu',
    endDate: 'Ngày Kết Thúc',
    receiptNo: 'Số Phiếu',
    type: 'Loại',
    reference: 'Tham Chiếu',
    partner: 'Đối Tác / Nguồn',
    destination: 'Đích Đến',
    expectedDate: 'Ngày Dự Kiến',
    status: 'Trạng Thái',
    actions: 'Thao Tác',
    view: 'Xem',
    edit: 'Sửa',
    approve: 'Phê Duyệt',
    submitForApproval: 'Gửi Chờ Duyệt',
    delete: 'Xóa',
    confirmDelete: 'Bạn có chắc chắn muốn xóa phiếu nhập này?',
    deleteDescription: 'Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn phiếu nhập kho và tất cả dữ liệu liên quan.',
    cancel: 'Hủy',
    deleteReceipt: 'Xóa Phiếu',
    noResults: 'Không tìm thấy phiếu nhập kho',
    total: 'Tổng',
    receipts: 'phiếu',
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
    Manual: 'Nhập Thủ Công'
  }
}

const statusColors = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Receiving: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function GoodsReceiptManagement() {
  const { language } = useLanguage()
  const t = translations[language]
  
  const [receipts, setReceipts] = useState<GoodsReceipt[]>(mockGoodsReceipts)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [destinationFilter, setDestinationFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [partnerFilter, setPartnerFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [receiptToDelete, setReceiptToDelete] = useState<string | null>(null)

  // Get unique warehouse destinations and sources
  const destinationWarehouses = [...new Set(receipts.map(r => r.to_wh_name))]
  const sourceWarehouses = [...new Set(receipts.filter(r => r.from_wh_name).map(r => r.from_wh_name!))]
  const partners = [...new Set(receipts.filter(r => r.partner_name).map(r => r.partner_name!))]

  const filteredReceipts = useMemo(() => {
    return receipts.filter(receipt => {
      const matchesSearch = 
        receipt.receipt_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.ref_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.from_wh_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        receipt.to_wh_name.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesStatus = statusFilter === 'all' || receipt.status === statusFilter
      
      const matchesType = typeFilter === 'all' || receipt.receipt_type === typeFilter
      
      const matchesDestination = destinationFilter === 'all' || receipt.to_wh_name === destinationFilter
      
      const matchesSource = sourceFilter === 'all' || (receipt.from_wh_name && receipt.from_wh_name === sourceFilter)
      
      const matchesPartner = partnerFilter === 'all' || (receipt.partner_name && receipt.partner_name === partnerFilter)
      
      let matchesDateRange = true
      if (startDate && endDate) {
        const receiptDate = new Date(receipt.expected_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDateRange = receiptDate >= start && receiptDate <= end
      } else if (startDate) {
        const receiptDate = new Date(receipt.expected_date)
        const start = new Date(startDate)
        matchesDateRange = receiptDate >= start
      } else if (endDate) {
        const receiptDate = new Date(receipt.expected_date)
        const end = new Date(endDate)
        matchesDateRange = receiptDate <= end
      }
      
      return matchesSearch && matchesStatus && matchesType && matchesDestination && matchesSource && matchesPartner && matchesDateRange
    })
  }, [receipts, searchTerm, statusFilter, typeFilter, destinationFilter, sourceFilter, partnerFilter, startDate, endDate])

  const handleCreate = () => {
    window.location.hash = '#warehouse/goods-receipt/create'
  }

  const handleEdit = (receipt: GoodsReceipt) => {
    // Store receipt ID in localStorage for editing
    localStorage.setItem('editingReceiptId', receipt.id)
    window.location.hash = '#warehouse/goods-receipt/edit'
  }

  const handleApprove = (receipt: GoodsReceipt) => {
    // Store receipt ID in localStorage for approval
    localStorage.setItem('approvingReceiptId', receipt.id)
    window.location.hash = '#warehouse/goods-receipt/approve'
  }

  const handleSubmitForApproval = (receipt: GoodsReceipt) => {
    // Store receipt ID in localStorage for submission
    localStorage.setItem('submittingReceiptId', receipt.id)
    window.location.hash = '#warehouse/goods-receipt/submit'
  }

  const handleView = (receipt: GoodsReceipt) => {
    // Store receipt ID in localStorage for viewing
    localStorage.setItem('viewingReceiptId', receipt.id)
    window.location.hash = '#warehouse/goods-receipt/view'
  }

  const handleDelete = (id: string) => {
    setReceipts(prev => prev.filter(r => r.id !== id))
    setDeleteDialogOpen(false)
    setReceiptToDelete(null)
    toast.success(language === 'vn' ? 'Xóa phiếu thành công' : 'Receipt deleted successfully')
  }

  const openDeleteDialog = (receiptId: string) => {
    setReceiptToDelete(receiptId)
    setDeleteDialogOpen(true)
  }

  const clearAllFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setDestinationFilter('all')
    setSourceFilter('all')
    setPartnerFilter('all')
    setStartDate('')
    setEndDate('')
  }

  const getPartnerOrSource = (receipt: GoodsReceipt) => {
    if (receipt.receipt_type === 'Transfer') {
      return receipt.from_wh_name || '-'
    } else if (receipt.receipt_type === 'PO' || receipt.receipt_type === 'Return') {
      return receipt.partner_name || '-'
    }
    return '-'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')
  }

  const exportData = () => {
    // Implement CSV export functionality
    const csvContent = 'data:text/csv;charset=utf-8,' + 
      [
        'Receipt No,Type,Reference,Partner/Source,Destination,Expected Date,Status',
        ...filteredReceipts.map(r => [
          r.receipt_no,
          t[r.receipt_type as keyof typeof t],
          r.ref_no || '',
          getPartnerOrSource(r),
          r.to_wh_name,
          r.expected_date,
          t[r.status as keyof typeof t]
        ].join(','))
      ].join('\n')
    
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'goods_receipts.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1>{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
            <CardTitle>{t.title}</CardTitle>
            <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-2">
              <Button onClick={exportData} variant="outline" size="sm">
                <FileDown className="w-4 h-4 mr-2" />
                {t.export}
              </Button>
              <Button onClick={handleCreate}>
                <Plus className="w-4 h-4 mr-2" />
                {t.create}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder={t.search}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          
          {/* Filters Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filter} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                <SelectItem value="Draft">{t.Draft}</SelectItem>
                <SelectItem value="Receiving">{t.Receiving}</SelectItem>
                <SelectItem value="Submitted">{t.Submitted}</SelectItem>
                <SelectItem value="Completed">{t.Completed}</SelectItem>
                <SelectItem value="Rejected">{t.Rejected}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterType} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTypes}</SelectItem>
                <SelectItem value="PO">{t.PO}</SelectItem>
                <SelectItem value="Transfer">{t.Transfer}</SelectItem>
                <SelectItem value="Return">{t.Return}</SelectItem>
                <SelectItem value="Manual">{t.Manual}</SelectItem>
              </SelectContent>
            </Select>
            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterDestination} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allWarehouses}</SelectItem>
                {destinationWarehouses.map((wh, index) => (
                  <SelectItem key={index} value={wh}>{wh}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterSource} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allWarehouses}</SelectItem>
                {sourceWarehouses.map((wh, index) => (
                  <SelectItem key={index} value={wh}>{wh}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={partnerFilter} onValueChange={setPartnerFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterPartner} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allPartners}</SelectItem>
                {partners.map((partner, index) => (
                  <SelectItem key={index} value={partner}>{partner}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex items-center space-x-2 col-span-1 sm:col-span-2 lg:col-span-1">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="flex-1"
                placeholder={t.startDate}
              />
              <span className="text-sm text-muted-foreground">{language === 'vn' ? 'đến' : 'to'}</span>
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="flex-1"
                placeholder={t.endDate}
              />
            </div>
            <div className="flex justify-end">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={clearAllFilters}
                className="h-10"
              >
                <X className="w-4 h-4 mr-2" />
                {t.clearFilters}
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.receiptNo}</TableHead>
                  <TableHead>{t.type}</TableHead>
                  <TableHead>{t.reference}</TableHead>
                  <TableHead>{t.partner}</TableHead>
                  <TableHead>{t.destination}</TableHead>
                  <TableHead>{t.expectedDate}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="w-[100px]">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReceipts.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={8} className="text-center py-8">
                      {t.noResults}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReceipts.map((receipt) => (
                    <TableRow key={receipt.id}>
                      <TableCell className="font-mono">{receipt.receipt_no}</TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {t[receipt.receipt_type as keyof typeof t]}
                        </Badge>
                      </TableCell>
                      <TableCell>{receipt.ref_no || '-'}</TableCell>
                      <TableCell>{getPartnerOrSource(receipt)}</TableCell>
                      <TableCell>{receipt.to_wh_name}</TableCell>
                      <TableCell>{formatDate(receipt.expected_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[receipt.status]}>
                          {t[receipt.status as keyof typeof t]}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleView(receipt)}>
                              <Eye className="w-4 h-4 mr-2" />
                              {t.view}
                            </DropdownMenuItem>
                            {(receipt.status === 'Draft' || receipt.status === 'Receiving') && (
                              <DropdownMenuItem onClick={() => handleEdit(receipt)}>
                                <Edit className="w-4 h-4 mr-2" />
                                {t.edit}
                              </DropdownMenuItem>
                            )}
                            {receipt.status === 'Submitted' && (
                              <DropdownMenuItem onClick={() => handleApprove(receipt)}>
                                <CheckCircle2 className="w-4 h-4 mr-2" />
                                {t.approve}
                              </DropdownMenuItem>
                            )}
                            {receipt.status === 'Receiving' && (
                              <DropdownMenuItem onClick={() => handleSubmitForApproval(receipt)}>
                                <Send className="w-4 h-4 mr-2" />
                                {t.submitForApproval}
                              </DropdownMenuItem>
                            )}
                            {receipt.status === 'Draft' && (
                              <DropdownMenuItem onClick={() => openDeleteDialog(receipt.id)}>
                                <Trash2 className="w-4 h-4 mr-2" />
                                {t.delete}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              {t.total}: {filteredReceipts.length} {t.receipts}
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.confirmDelete}</AlertDialogTitle>
            <AlertDialogDescription>
              {t.deleteDescription}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setDeleteDialogOpen(false)}>
              {t.cancel}
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={() => receiptToDelete && handleDelete(receiptToDelete)}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t.deleteReceipt}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}