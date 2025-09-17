import { useMemo, useState } from 'react'
import { Plus, Search, FileDown, FileUp, Eye, Edit, Send, CheckCircle2, Ban, MoreHorizontal } from 'lucide-react'
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
import { toast } from 'sonner'

type Translation = {
  title: string
  description: string
  create: string
  search: string
  filter: string
  filterType: string
  filterSource: string
  filterDestination: string
  filterRequest: string
  filterDate: string
  export: string
  import: string
  clearFilters: string
  allStatuses: string
  allTypes: string
  allWarehouses: string
  allDestinations: string
  allRequestors: string
  dateRange: string
  startDate: string
  endDate: string
  issueNo: string
  type: string
  reference: string
  requestor: string
  source: string
  destination: string
  issueDate: string
  status: string
  actions: string
  view: string
  edit: string
  submit: string
  complete: string
  cancelIssue: string
  confirmCancel: string
  cancelDescription: string
  cancel: string
  confirm: string
  noResults: string
  total: string
  issues: string
  statusLabels: Record<GoodsIssue['status'], string>
  typeLabels: Record<GoodsIssue['issue_type'], string>
  messages: {
    createSoon: string
    editSoon: string
    viewSoon: string
    submitSuccess: (issueNo: string) => string
    completeSuccess: (issueNo: string) => string
    cancelSuccess: (issueNo: string) => string
  }
}

const translations: Record<'en' | 'vn', Translation> = {
  en: {
    title: 'Goods Issue Management',
    description: 'Manage goods issues, process requests, and track issuing status',
    create: 'Create Issue',
    search: 'Search issues...',
    filter: 'Filter by Status',
    filterType: 'Filter by Type',
    filterSource: 'Filter by Source Warehouse',
    filterDestination: 'Filter by Destination',
    filterRequest: 'Filter by Requestor',
    filterDate: 'Filter by Date Range',
    export: 'Export',
    import: 'Import',
    clearFilters: 'Clear Filters',
    allStatuses: 'All Statuses',
    allTypes: 'All Types',
    allWarehouses: 'All Warehouses',
    allDestinations: 'All Destinations',
    allRequestors: 'All Requestors',
    dateRange: 'Date Range',
    startDate: 'Start Date',
    endDate: 'End Date',
    issueNo: 'Issue No',
    type: 'Type',
    reference: 'Reference',
    requestor: 'Requestor',
    source: 'Source',
    destination: 'Destination',
    issueDate: 'Issue Date',
    status: 'Status',
    actions: 'Actions',
    view: 'View',
    edit: 'Edit',
    submit: 'Submit for Approval',
    complete: 'Mark Completed',
    cancelIssue: 'Cancel Issue',
    confirmCancel: 'Are you sure you want to cancel this goods issue?',
    cancelDescription: 'This action will mark the goods issue as cancelled and cannot be undone.',
    cancel: 'Cancel',
    confirm: 'Confirm',
    noResults: 'No goods issues found',
    total: 'Total',
    issues: 'issues',
    statusLabels: {
      Draft: 'Draft',
      Picking: 'Picking',
      Submitted: 'Submitted',
      Completed: 'Completed',
      Cancelled: 'Cancelled'
    },
    typeLabels: {
      SO: 'Sales Order',
      Transfer: 'Transfer',
      Return: 'Return',
      Manual: 'Manual Entry',
      Production: 'Production'
    },
    messages: {
      createSoon: 'Goods issue creation will be available soon.',
      editSoon: 'Editing goods issues will be available soon.',
      viewSoon: 'Detailed view for goods issues is coming soon.',
      submitSuccess: issueNo => `Goods issue ${issueNo} submitted for approval.`,
      completeSuccess: issueNo => `Goods issue ${issueNo} marked as completed.`,
      cancelSuccess: issueNo => `Goods issue ${issueNo} has been cancelled.`
    }
  },
  vn: {
    title: 'Quản Lý Phiếu Xuất Kho',
    description: 'Quản lý phiếu xuất kho, xử lý yêu cầu và theo dõi trạng thái xuất hàng',
    create: 'Tạo Phiếu',
    search: 'Tìm kiếm phiếu...',
    filter: 'Lọc theo Trạng Thái',
    filterType: 'Lọc theo Loại',
    filterSource: 'Lọc theo Kho Xuất',
    filterDestination: 'Lọc theo Đích Đến',
    filterRequest: 'Lọc theo Bộ phận/Yêu cầu',
    filterDate: 'Lọc theo Khoảng Ngày',
    export: 'Xuất File',
    import: 'Nhập File',
    clearFilters: 'Xóa Lọc',
    allStatuses: 'Tất Cả Trạng Thái',
    allTypes: 'Tất Cả Loại',
    allWarehouses: 'Tất Cả Kho',
    allDestinations: 'Tất Cả Đích Đến',
    allRequestors: 'Tất Cả Yêu Cầu',
    dateRange: 'Khoảng Ngày',
    startDate: 'Ngày Bắt Đầu',
    endDate: 'Ngày Kết Thúc',
    issueNo: 'Số Phiếu',
    type: 'Loại',
    reference: 'Tham Chiếu',
    requestor: 'Bộ phận/Yêu cầu',
    source: 'Kho Xuất',
    destination: 'Đích Đến',
    issueDate: 'Ngày Xuất',
    status: 'Trạng Thái',
    actions: 'Thao Tác',
    view: 'Xem',
    edit: 'Sửa',
    submit: 'Gửi Duyệt',
    complete: 'Hoàn Thành',
    cancelIssue: 'Hủy Phiếu',
    confirmCancel: 'Bạn có chắc chắn muốn hủy phiếu xuất kho này?',
    cancelDescription: 'Thao tác này sẽ chuyển phiếu sang trạng thái hủy và không thể hoàn tác.',
    cancel: 'Hủy',
    confirm: 'Xác nhận',
    noResults: 'Không tìm thấy phiếu xuất kho',
    total: 'Tổng',
    issues: 'phiếu',
    statusLabels: {
      Draft: 'Nháp',
      Picking: 'Đang Soạn Hàng',
      Submitted: 'Đã Gửi',
      Completed: 'Hoàn Thành',
      Cancelled: 'Đã Hủy'
    },
    typeLabels: {
      SO: 'Đơn Bán',
      Transfer: 'Chuyển Kho',
      Return: 'Trả Hàng',
      Manual: 'Nhập Tay',
      Production: 'Sản Xuất'
    },
    messages: {
      createSoon: 'Chức năng tạo phiếu xuất kho sẽ sớm khả dụng.',
      editSoon: 'Chức năng chỉnh sửa phiếu xuất kho sẽ sớm khả dụng.',
      viewSoon: 'Màn hình chi tiết phiếu xuất kho đang được phát triển.',
      submitSuccess: issueNo => `Phiếu xuất ${issueNo} đã được gửi phê duyệt.`,
      completeSuccess: issueNo => `Phiếu xuất ${issueNo} đã được đánh dấu hoàn thành.`,
      cancelSuccess: issueNo => `Phiếu xuất ${issueNo} đã bị hủy.`
    }
  }
}

const statusColors: Record<GoodsIssue['status'], string> = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Picking: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Submitted: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

export function GoodsIssueManagement() {
  const { language } = useLanguage()
  const t = translations[language]

  const [issues, setIssues] = useState<GoodsIssue[]>(mockGoodsIssues)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [sourceFilter, setSourceFilter] = useState<string>('all')
  const [destinationFilter, setDestinationFilter] = useState<string>('all')
  const [requestFilter, setRequestFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState<string>('')
  const [endDate, setEndDate] = useState<string>('')
  const [cancelDialogOpen, setCancelDialogOpen] = useState(false)
  const [issueToCancel, setIssueToCancel] = useState<string | null>(null)

  const sourceWarehouses = useMemo(
    () => [...new Set(issues.map(issue => issue.from_wh_name))].filter(Boolean),
    [issues]
  )
  const destinations = useMemo(
    () => [...new Set(issues.map(issue => issue.to_wh_name).filter(Boolean))] as string[],
    [issues]
  )
  const requestors = useMemo(
    () => [
      ...new Set(
        issues.map(issue => issue.request_dept || issue.partner_name).filter((value): value is string => Boolean(value))
      )
    ],
    [issues]
  )

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const matchesSearch =
        issue.issue_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.ref_no?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.partner_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.request_dept?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.from_wh_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (issue.to_wh_name && issue.to_wh_name.toLowerCase().includes(searchTerm.toLowerCase()))

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
      const matchesType = typeFilter === 'all' || issue.issue_type === typeFilter
      const matchesSource = sourceFilter === 'all' || issue.from_wh_name === sourceFilter
      const matchesDestination = destinationFilter === 'all' || issue.to_wh_name === destinationFilter
      const matchesRequestor =
        requestFilter === 'all' ||
        issue.request_dept === requestFilter ||
        issue.partner_name === requestFilter

      let matchesDateRange = true
      if (startDate && endDate) {
        const issueDate = new Date(issue.issue_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDateRange = issueDate >= start && issueDate <= end
      } else if (startDate) {
        const issueDate = new Date(issue.issue_date)
        const start = new Date(startDate)
        matchesDateRange = issueDate >= start
      } else if (endDate) {
        const issueDate = new Date(issue.issue_date)
        const end = new Date(endDate)
        matchesDateRange = issueDate <= end
      }

      return (
        matchesSearch &&
        matchesStatus &&
        matchesType &&
        matchesSource &&
        matchesDestination &&
        matchesRequestor &&
        matchesDateRange
      )
    })
  }, [
    issues,
    searchTerm,
    statusFilter,
    typeFilter,
    sourceFilter,
    destinationFilter,
    requestFilter,
    startDate,
    endDate
  ])

  const handleCreate = () => {
    toast.info(t.messages.createSoon)
  }

  const handleView = (issue: GoodsIssue) => {
    toast.info(t.messages.viewSoon)
  }

  const handleEdit = (issue: GoodsIssue) => {
    toast.info(t.messages.editSoon)
  }

  const handleSubmit = (issue: GoodsIssue) => {
    setIssues(prev =>
      prev.map(item =>
        item.id === issue.id
          ? {
              ...item,
              status: 'Submitted',
              submitted_at: new Date().toISOString()
            }
          : item
      )
    )
    toast.success(t.messages.submitSuccess(issue.issue_no))
  }

  const handleComplete = (issue: GoodsIssue) => {
    setIssues(prev =>
      prev.map(item =>
        item.id === issue.id
          ? {
              ...item,
              status: 'Completed',
              updated_at: new Date().toISOString()
            }
          : item
      )
    )
    toast.success(t.messages.completeSuccess(issue.issue_no))
  }

  const handleOpenCancelDialog = (issue: GoodsIssue) => {
    setIssueToCancel(issue.id)
    setCancelDialogOpen(true)
  }

  const handleConfirmCancel = () => {
    if (!issueToCancel) return

    setIssues(prev =>
      prev.map(issue =>
        issue.id === issueToCancel
          ? {
              ...issue,
              status: 'Cancelled',
              cancelled_at: new Date().toISOString()
            }
          : issue
      )
    )

    const cancelledIssue = issues.find(issue => issue.id === issueToCancel)
    if (cancelledIssue) {
      toast.success(t.messages.cancelSuccess(cancelledIssue.issue_no))
    }

    setCancelDialogOpen(false)
    setIssueToCancel(null)
  }

  const handleClearFilters = () => {
    setStatusFilter('all')
    setTypeFilter('all')
    setSourceFilter('all')
    setDestinationFilter('all')
    setRequestFilter('all')
    setStartDate('')
    setEndDate('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </div>

      <Card>
        <CardHeader className="space-y-4 md:flex md:flex-row md:items-center md:justify-between md:space-y-0">
          <CardTitle>{t.title}</CardTitle>
          <div className="flex flex-col gap-2 md:flex-row">
            <Button onClick={handleCreate}>
              <Plus className="mr-2 h-4 w-4" />
              {t.create}
            </Button>
            <div className="flex gap-2">
              <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                {t.export}
              </Button>
              <Button variant="outline">
                <FileUp className="mr-2 h-4 w-4" />
                {t.import}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-4">
            <div className="md:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={searchTerm}
                  onChange={event => setSearchTerm(event.target.value)}
                  placeholder={t.search}
                  className="pl-9"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filter}>
                  {statusFilter === 'all' ? t.filter : t.statusLabels[statusFilter as GoodsIssue['status']]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allStatuses}</SelectItem>
                {Object.entries(t.statusLabels).map(([status, label]) => (
                  <SelectItem key={status} value={status}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterType}>
                  {typeFilter === 'all' ? t.filterType : t.typeLabels[typeFilter as GoodsIssue['issue_type']]}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allTypes}</SelectItem>
                {Object.entries(t.typeLabels).map(([type, label]) => (
                  <SelectItem key={type} value={type}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 md:grid-cols-4">
            <Select value={sourceFilter} onValueChange={setSourceFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterSource}>
                  {sourceFilter === 'all' ? t.filterSource : sourceFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allWarehouses}</SelectItem>
                {sourceWarehouses.map(warehouse => (
                  <SelectItem key={warehouse} value={warehouse}>
                    {warehouse}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={destinationFilter} onValueChange={setDestinationFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterDestination}>
                  {destinationFilter === 'all' ? t.filterDestination : destinationFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allDestinations}</SelectItem>
                {destinations.map(destination => (
                  <SelectItem key={destination} value={destination}>
                    {destination}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={requestFilter} onValueChange={setRequestFilter}>
              <SelectTrigger>
                <SelectValue placeholder={t.filterRequest}>
                  {requestFilter === 'all' ? t.filterRequest : requestFilter}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t.allRequestors}</SelectItem>
                {requestors.map(requestor => (
                  <SelectItem key={requestor} value={requestor}>
                    {requestor}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex gap-2">
              <div className="w-1/2">
                <Input
                  type="date"
                  value={startDate}
                  onChange={event => setStartDate(event.target.value)}
                  placeholder={t.startDate}
                />
              </div>
              <div className="w-1/2">
                <Input
                  type="date"
                  value={endDate}
                  onChange={event => setEndDate(event.target.value)}
                  placeholder={t.endDate}
                />
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-muted-foreground">
              {t.total}: {filteredIssues.length} {t.issues}
            </span>
            <Button variant="outline" size="sm" onClick={handleClearFilters}>
              {t.clearFilters}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-0">
          {filteredIssues.length === 0 ? (
            <div className="p-6 text-center text-sm text-muted-foreground">{t.noResults}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t.issueNo}</TableHead>
                  <TableHead>{t.type}</TableHead>
                  <TableHead>{t.reference}</TableHead>
                  <TableHead>{t.requestor}</TableHead>
                  <TableHead>{t.source}</TableHead>
                  <TableHead>{t.destination}</TableHead>
                  <TableHead>{t.issueDate}</TableHead>
                  <TableHead>{t.status}</TableHead>
                  <TableHead className="text-right">{t.actions}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIssues.map(issue => (
                  <TableRow key={issue.id}>
                    <TableCell className="font-medium">{issue.issue_no}</TableCell>
                    <TableCell>{t.typeLabels[issue.issue_type]}</TableCell>
                    <TableCell>{issue.ref_no || '—'}</TableCell>
                    <TableCell>{issue.request_dept || issue.partner_name || '—'}</TableCell>
                    <TableCell>{issue.from_wh_name}</TableCell>
                    <TableCell>{issue.to_wh_name || '—'}</TableCell>
                    <TableCell>{new Date(issue.issue_date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusColors[issue.status]}>
                        {t.statusLabels[issue.status]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="ghost" size="icon" onClick={() => handleView(issue)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleEdit(issue)}>
                          <Edit className="h-4 w-4" />
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onSelect={() => handleSubmit(issue)}>
                              <Send className="mr-2 h-4 w-4" />
                              {t.submit}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleComplete(issue)}>
                              <CheckCircle2 className="mr-2 h-4 w-4" />
                              {t.complete}
                            </DropdownMenuItem>
                            <DropdownMenuItem onSelect={() => handleOpenCancelDialog(issue)}>
                              <Ban className="mr-2 h-4 w-4" />
                              {t.cancelIssue}
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog open={cancelDialogOpen} onOpenChange={setCancelDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t.cancelIssue}</AlertDialogTitle>
            <AlertDialogDescription>{t.confirmCancel}</AlertDialogDescription>
            <p className="text-sm text-muted-foreground">{t.cancelDescription}</p>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t.cancel}</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmCancel}>{t.confirm}</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
