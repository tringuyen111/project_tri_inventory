import { useMemo, useState } from 'react'
import {
  Plus,
  Search,
  Filter,
  FileDown,
  Eye,
  Send,
  CheckCircle2,
  X,
  MoreHorizontal
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from '../ui/alert-dialog'
import { useLanguage } from '../../contexts/LanguageContext'
import { mockGoodsIssues } from '../../data/mockGoodsIssueData'
import { GoodsIssue } from '../../types/goodsIssue'
import { toast } from 'sonner@2.0.3'

const translations = {
  en: {
    title: 'Goods Issue Management',
    description: 'Track, review and approve all goods issue requests raised from the warehouse',
    create: 'Create Goods Issue',
    search: 'Search goods issue...',
    filterStatus: 'Filter by Status',
    filterType: 'Filter by Issue Type',
    filterWarehouse: 'Filter by Source Warehouse',
    filterPartner: 'Filter by Partner',
    allStatuses: 'All Statuses',
    allTypes: 'All Types',
    allWarehouses: 'All Warehouses',
    allPartners: 'All Partners',
    export: 'Export',
    view: 'View Detail',
    submit: 'Submit',
    approve: 'Approve',
    cancel: 'Cancel',
    confirmSubmit: 'Submit goods issue',
    confirmSubmitDescription: 'Are you sure you want to submit this goods issue for approval?',
    confirmApprove: 'Approve goods issue',
    confirmApproveDescription: 'Confirm approval to post the picking result.',
    confirmCancel: 'Cancel goods issue',
    confirmCancelDescription: 'This will cancel the goods issue. The GI number will remain in history.',
    issueNo: 'Goods Issue No',
    issueType: 'Issue Type',
    sourceWarehouse: 'Source Warehouse',
    partner: 'Partner / Destination',
    expectedDate: 'Expected Date',
    status: 'Status',
    actions: 'Actions',
    total: 'Total',
    records: 'records',
    Draft: 'Draft',
    Picking: 'Picking',
    AdjustmentRequested: 'Adjustment Requested',
    Submitted: 'Submitted',
    Approved: 'Approved',
    Completed: 'Completed',
    Cancelled: 'Cancelled',
    SO: 'Sales Order',
    Transfer: 'Transfer',
    ReturnToSupplier: 'Return to Supplier',
    Adjustment: 'Adjustment',
    Manual: 'Manual'
  },
  vn: {
    title: 'Quản Lý Phiếu Xuất Kho',
    description: 'Theo dõi, rà soát và phê duyệt tất cả yêu cầu xuất kho từ bộ phận kho',
    create: 'Tạo phiếu xuất kho',
    search: 'Tìm kiếm phiếu xuất...',
    filterStatus: 'Lọc theo trạng thái',
    filterType: 'Lọc theo loại phiếu',
    filterWarehouse: 'Lọc theo kho xuất',
    filterPartner: 'Lọc theo đối tác / kho nhận',
    allStatuses: 'Tất cả trạng thái',
    allTypes: 'Tất cả loại',
    allWarehouses: 'Tất cả kho',
    allPartners: 'Tất cả đối tác',
    export: 'Xuất file',
    view: 'Xem chi tiết',
    submit: 'Gửi duyệt',
    approve: 'Phê duyệt',
    cancel: 'Hủy phiếu',
    confirmSubmit: 'Gửi phiếu xuất',
    confirmSubmitDescription: 'Bạn có chắc chắn muốn gửi phiếu này để phê duyệt?',
    confirmApprove: 'Phê duyệt phiếu xuất',
    confirmApproveDescription: 'Xác nhận phê duyệt để ghi nhận kết quả picking.',
    confirmCancel: 'Hủy phiếu xuất',
    confirmCancelDescription: 'Phiếu sẽ bị hủy nhưng vẫn giữ lại số phiếu trong lịch sử.',
    issueNo: 'Số phiếu xuất kho',
    issueType: 'Loại phiếu',
    sourceWarehouse: 'Kho xuất',
    partner: 'Đối tác / Kho nhận',
    expectedDate: 'Ngày dự kiến',
    status: 'Trạng thái',
    actions: 'Thao tác',
    total: 'Tổng',
    records: 'phiếu',
    Draft: 'Nháp',
    Picking: 'Đang picking',
    AdjustmentRequested: 'Yêu cầu điều chỉnh',
    Submitted: 'Đã gửi',
    Approved: 'Đã duyệt',
    Completed: 'Hoàn tất',
    Cancelled: 'Đã hủy',
    SO: 'Đơn bán hàng',
    Transfer: 'Chuyển kho',
    ReturnToSupplier: 'Trả NCC',
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

export function GoodsIssueManagement() {
  const { language } = useLanguage()
  const t = translations[language]

  const [issues, setIssues] = useState<GoodsIssue[]>(mockGoodsIssues)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [warehouseFilter, setWarehouseFilter] = useState('all')
  const [partnerFilter, setPartnerFilter] = useState('all')
  const [confirmAction, setConfirmAction] = useState<'submit' | 'approve' | 'cancel' | null>(null)
  const [selectedIssue, setSelectedIssue] = useState<GoodsIssue | null>(null)

  const warehouses = [...new Set(issues.map(issue => issue.from_wh_name).filter(Boolean))]
  const partnersOrDestinations = [
    ...new Set(
      issues
        .map(issue => issue.partner_name || issue.to_wh_name || '')
        .filter(Boolean)
    )
  ]

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch =
        issue.gi_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.to_wh_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.from_wh_name.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
      const matchesType = typeFilter === 'all' || issue.issue_type === typeFilter
      const matchesWarehouse = warehouseFilter === 'all' || issue.from_wh_name === warehouseFilter
      const matchesPartner =
        partnerFilter === 'all' || issue.partner_name === partnerFilter || issue.to_wh_name === partnerFilter

      return matchesSearch && matchesStatus && matchesType && matchesWarehouse && matchesPartner
    })
  }, [issues, searchTerm, statusFilter, typeFilter, warehouseFilter, partnerFilter])

  const handleNavigateDetail = (issue: GoodsIssue) => {
    localStorage.setItem('viewingGoodsIssueId', issue.id)
    window.location.hash = '#warehouse/goods-issue/view'
  }

  const updateIssueStatus = (issue: GoodsIssue, status: GoodsIssue['status']) => {
    setIssues(prev => prev.map(item => (item.id === issue.id ? { ...item, status } : item)))
    const statusLabel = t[status as keyof typeof t] || status
    toast.success(`${statusLabel} - ${issue.gi_no}`)
  }

  const handleConfirmAction = () => {
    if (!selectedIssue || !confirmAction) return

    if (confirmAction === 'submit') {
      updateIssueStatus(selectedIssue, 'Submitted')
    } else if (confirmAction === 'approve') {
      updateIssueStatus(selectedIssue, 'Approved')
    } else if (confirmAction === 'cancel') {
      updateIssueStatus(selectedIssue, 'Cancelled')
    }

    setConfirmAction(null)
    setSelectedIssue(null)
  }

  const renderActionDialog = () => {
    if (!confirmAction || !selectedIssue) return null

    const dialogCopy = {
      submit: {
        title: t.confirmSubmit,
        description: t.confirmSubmitDescription
      },
      approve: {
        title: t.confirmApprove,
        description: t.confirmApproveDescription
      },
      cancel: {
        title: t.confirmCancel,
        description: t.confirmCancelDescription
      }
    }[confirmAction]

    return (
      <AlertDialog open onOpenChange={open => !open && setConfirmAction(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{dialogCopy.title}</AlertDialogTitle>
            <AlertDialogDescription>{dialogCopy.description}</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setConfirmAction(null)}>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmAction}>
              {confirmAction === 'submit' ? t.submit : confirmAction === 'approve' ? t.approve : t.cancel}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    )
  }

  const renderActions = (issue: GoodsIssue) => (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={() => handleNavigateDetail(issue)}>
        <Eye className="mr-1 h-4 w-4" />
        {t.view}
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" size="sm">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem
            onClick={() => {
              setSelectedIssue(issue)
              setConfirmAction('submit')
            }}
          >
            <Send className="mr-2 h-4 w-4" />
            {t.submit}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => {
              setSelectedIssue(issue)
              setConfirmAction('approve')
            }}
          >
            <CheckCircle2 className="mr-2 h-4 w-4" />
            {t.approve}
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive focus:text-destructive"
            onClick={() => {
              setSelectedIssue(issue)
              setConfirmAction('cancel')
            }}
          >
            <X className="mr-2 h-4 w-4" />
            {t.cancel}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{t.title}</h1>
          <p className="text-muted-foreground">{t.description}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {t.create}
          </Button>
          <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            {t.export}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <CardTitle className="text-base font-medium">{t.filterStatus}</CardTitle>
          <div className="flex w-full flex-col gap-3 md:w-auto md:flex-row">
            <div className="relative md:w-72">
              <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                className="pl-9"
                placeholder={t.search}
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
              />
            </div>
            <div className="flex flex-col gap-3 md:flex-row">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.filterStatus} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allStatuses}</SelectItem>
                  {['Draft', 'Picking', 'AdjustmentRequested', 'Submitted', 'Approved', 'Completed', 'Cancelled'].map(status => (
                    <SelectItem key={status} value={status}>
                      {t[status as keyof typeof t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.filterType} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allTypes}</SelectItem>
                  {['SO', 'Transfer', 'ReturnToSupplier', 'Adjustment', 'Manual'].map(type => (
                    <SelectItem key={type} value={type}>
                      {t[type as keyof typeof t]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={warehouseFilter} onValueChange={setWarehouseFilter}>
                <SelectTrigger className="md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.filterWarehouse} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allWarehouses}</SelectItem>
                  {warehouses.map(warehouse => (
                    <SelectItem key={warehouse} value={warehouse}>
                      {warehouse}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={partnerFilter} onValueChange={setPartnerFilter}>
                <SelectTrigger className="md:w-48">
                  <Filter className="mr-2 h-4 w-4" />
                  <SelectValue placeholder={t.filterPartner} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t.allPartners}</SelectItem>
                  {partnersOrDestinations.map(partner => (
                    <SelectItem key={partner} value={partner}>
                      {partner}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="min-w-[160px]">{t.issueNo}</TableHead>
                  <TableHead>{t.issueType}</TableHead>
                  <TableHead>{t.sourceWarehouse}</TableHead>
                  <TableHead>{t.partner}</TableHead>
                  <TableHead>{t.expectedDate}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map(issue => (
                  <TableRow key={issue.id} className="hover:bg-muted/50">
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span>{issue.gi_no}</span>
                        <span className="text-xs text-muted-foreground">
                          {t.total}: {issue.lines.length} / {issue.lines.reduce((acc, line) => acc + line.qty_planned, 0)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{t[issue.issue_type as keyof typeof t]}</TableCell>
                    <TableCell>{issue.from_wh_name}</TableCell>
                    <TableCell>{issue.partner_name || issue.to_wh_name || '-'}</TableCell>
                    <TableCell>{new Date(issue.expected_date).toLocaleDateString(language === 'vn' ? 'vi-VN' : 'en-US')}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[issue.status]}>{t[issue.status as keyof typeof t]}</Badge>
                    </TableCell>
                    <TableCell className="text-right">{renderActions(issue)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground">
            <div>
              {t.total}: {filteredIssues.length} {t.records}
            </div>
          </div>
        </CardContent>
      </Card>

      {renderActionDialog()}
    </div>
  )
}
