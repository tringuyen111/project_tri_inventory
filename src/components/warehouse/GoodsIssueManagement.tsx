import { useMemo, useState } from 'react'
import { ClipboardList, Edit, Filter, MoreHorizontal, Plus, Search } from 'lucide-react'
import { toast } from 'sonner'

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table'
import { Badge } from '../ui/badge'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../ui/dropdown-menu'

import { GoodsIssue } from '../../types/goodsIssue'
import { useLanguage } from '../../contexts/LanguageContext'
import { useGoodsIssues } from '../../contexts/GoodsIssueContext'
import { GoodsIssueDraftForm } from './GoodsIssueDraftForm'
import { GoodsIssuePickingPanel } from './GoodsIssuePickingPanel'

const statusColors: Record<GoodsIssue['status'], string> = {
  Draft: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200',
  Picking: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  AdjustmentRequested: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
  Submitted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  Approved: 'bg-violet-100 text-violet-800 dark:bg-violet-900 dark:text-violet-200',
  Completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  Cancelled: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
}

const translations = {
  en: {
    title: 'Goods Issue Management',
    description: 'Review and manage goods issues, monitor picking progress, and track fulfillment accuracy.',
    searchPlaceholder: 'Search GI number, partner or warehouse...',
    statusFilter: 'Status',
    typeFilter: 'Type',
    expectedDateFilter: 'Expected Date',
    startDate: 'Start Date',
    endDate: 'End Date',
    clearFilters: 'Clear Filters',
    createButton: 'Create Goods Issue',
    issueNo: 'GI Number',
    issueType: 'Type',
    partner: 'Partner / Destination',
    fromWarehouse: 'From Warehouse',
    toWarehouse: 'To Warehouse',
    expectedDate: 'Expected Date',
    status: 'Status',
    totalPlanned: 'Total Planned',
    totalPicked: 'Total Picked',
    totalDiff: 'Difference',
    createdAt: 'Created At',
    createdBy: 'Created By',
    actions: 'Actions',
    manageWorkflow: 'Manage Workflow',
    editDraft: 'Edit Draft',
    startPicking: 'Start Picking',
    summaryTotals: (planned: number, picked: number, diff: number) =>
      `Planned: ${planned.toLocaleString()} • Picked: ${picked.toLocaleString()} • Diff: ${diff.toLocaleString()}`,
    noResults: 'No goods issues found'
  },
  vn: {
    title: 'Quản Lý Phiếu Xuất Kho',
    description: 'Theo dõi phiếu xuất kho, tình trạng soạn hàng và độ chính xác thực hiện.',
    searchPlaceholder: 'Tìm số phiếu, đối tác hoặc kho...',
    statusFilter: 'Trạng thái',
    typeFilter: 'Loại',
    expectedDateFilter: 'Ngày dự kiến',
    startDate: 'Từ ngày',
    endDate: 'Đến ngày',
    clearFilters: 'Xóa lọc',
    createButton: 'Tạo Phiếu Xuất',
    issueNo: 'Số phiếu',
    issueType: 'Loại',
    partner: 'Đối tác / Điểm đến',
    fromWarehouse: 'Kho xuất',
    toWarehouse: 'Kho nhận',
    expectedDate: 'Ngày dự kiến',
    status: 'Trạng thái',
    totalPlanned: 'Tổng kế hoạch',
    totalPicked: 'Tổng đã soạn',
    totalDiff: 'Chênh lệch',
    createdAt: 'Ngày tạo',
    createdBy: 'Người tạo',
    actions: 'Thao tác',
    manageWorkflow: 'Quản lý quy trình',
    editDraft: 'Chỉnh sửa nháp',
    startPicking: 'Bắt đầu soạn hàng',
    summaryTotals: (planned: number, picked: number, diff: number) =>
      `Kế hoạch: ${planned.toLocaleString()} • Đã soạn: ${picked.toLocaleString()} • Chênh: ${diff.toLocaleString()}`,
    noResults: 'Không có phiếu xuất kho'
  }
}

const formatDate = (dateString: string, withTime = false) => {
  const date = new Date(dateString)
  if (Number.isNaN(date.getTime())) {
    return dateString
  }

  return withTime
    ? date.toLocaleString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
      })
    : date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: '2-digit'
      })
}

const calculateTotals = (issue: GoodsIssue) =>
  issue.lines.reduce(
    (acc, line) => {
      acc.planned += line.planned_qty
      acc.picked += line.picked_qty
      return acc
    },
    { planned: 0, picked: 0 }
  )

export function GoodsIssueManagement() {
  const { language } = useLanguage()
  const { issues, transitionStatus } = useGoodsIssues()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [showDraftForm, setShowDraftForm] = useState(false)
  const [draftToEdit, setDraftToEdit] = useState<GoodsIssue | undefined>()
  const [activeIssueNo, setActiveIssueNo] = useState<string>()

  const selectedLanguage: keyof typeof translations = language in translations ? language : 'en'
  const t = translations[selectedLanguage]

  const uniqueStatuses = useMemo(
    () => Array.from(new Set(issues.map(issue => issue.status))),
    [issues]
  )
  const uniqueTypes = useMemo(
    () => Array.from(new Set(issues.map(issue => issue.issue_type))),
    [issues]
  )

  const filteredIssues = useMemo(() => {
    return issues.filter(issue => {
      const search = searchTerm.trim().toLowerCase()

      const matchesSearch =
        !search ||
        issue.issue_no.toLowerCase().includes(search) ||
        issue.partner_name?.toLowerCase().includes(search) ||
        issue.from_wh_name.toLowerCase().includes(search) ||
        issue.to_wh_name?.toLowerCase().includes(search) ||
        issue.created_by.toLowerCase().includes(search)

      const matchesStatus = statusFilter === 'all' || issue.status === statusFilter
      const matchesType = typeFilter === 'all' || issue.issue_type === typeFilter

      let matchesDate = true
      if (startDate && endDate) {
        const issueDate = new Date(issue.expected_date)
        const start = new Date(startDate)
        const end = new Date(endDate)
        matchesDate = issueDate >= start && issueDate <= end
      } else if (startDate) {
        const issueDate = new Date(issue.expected_date)
        const start = new Date(startDate)
        matchesDate = issueDate >= start
      } else if (endDate) {
        const issueDate = new Date(issue.expected_date)
        const end = new Date(endDate)
        matchesDate = issueDate <= end
      }

      return matchesSearch && matchesStatus && matchesType && matchesDate
    })
  }, [issues, searchTerm, statusFilter, typeFilter, startDate, endDate])

  const overallTotals = useMemo(() => {
    return issues.reduce(
      (totals, issue) => {
        const issueTotals = calculateTotals(issue)
        totals.planned += issueTotals.planned
        totals.picked += issueTotals.picked
        totals.diff += issueTotals.picked - issueTotals.planned
        return totals
      },
      { planned: 0, picked: 0, diff: 0 }
    )
  }, [issues])

  const clearFilters = () => {
    setSearchTerm('')
    setStatusFilter('all')
    setTypeFilter('all')
    setStartDate('')
    setEndDate('')
  }

  const openCreateDraft = () => {
    setDraftToEdit(undefined)
    setShowDraftForm(true)
  }

  const openEditDraft = (issue: GoodsIssue) => {
    setDraftToEdit(issue)
    setShowDraftForm(true)
  }

  const openPicking = (issue: GoodsIssue) => {
    setActiveIssueNo(issue.issue_no)
  }

  const handleStartPicking = (issue: GoodsIssue) => {
    const result = transitionStatus(issue.issue_no, 'Picking')
    if (!result.success) {
      toast.error(result.error)
      return
    }
    toast.success('Goods issue moved to Picking')
    openPicking(issue)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-2xl font-semibold">{t.title}</CardTitle>
          <p className="text-sm text-muted-foreground">{t.description}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full items-center gap-2 lg:w-72">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={event => setSearchTerm(event.target.value)}
                placeholder={t.searchPlaceholder}
              />
            </div>
            <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
              <div className="flex items-center gap-2">
                <Filter className="hidden h-4 w-4 text-muted-foreground lg:block" />
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t.statusFilter}>
                      {statusFilter === 'all' ? t.statusFilter : statusFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueStatuses.map(status => (
                      <SelectItem key={status} value={status}>
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-[160px]">
                    <SelectValue placeholder={t.typeFilter}>
                      {typeFilter === 'all' ? t.typeFilter : typeFilter}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    {uniqueTypes.map(type => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button className="w-full lg:w-auto" onClick={openCreateDraft}>
              <Plus className="mr-2 h-4 w-4" />
              {t.createButton}
            </Button>
          </div>
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex w-full flex-col gap-3 lg:flex-row lg:items-center">
              <div className="flex flex-col gap-1 lg:flex-row lg:items-center">
                <span className="text-xs font-medium uppercase text-muted-foreground">{t.startDate}</span>
                <Input type="date" value={startDate} onChange={event => setStartDate(event.target.value)} />
              </div>
              <div className="flex flex-col gap-1 lg:flex-row lg:items-center">
                <span className="text-xs font-medium uppercase text-muted-foreground">{t.endDate}</span>
                <Input type="date" value={endDate} onChange={event => setEndDate(event.target.value)} />
              </div>
            </div>
            <Button variant="outline" onClick={clearFilters}>
              {t.clearFilters}
            </Button>
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t.issueNo}</TableHead>
                <TableHead>{t.issueType}</TableHead>
                <TableHead>{t.partner}</TableHead>
                <TableHead>{t.fromWarehouse}</TableHead>
                <TableHead>{t.toWarehouse}</TableHead>
                <TableHead>{t.expectedDate}</TableHead>
                <TableHead>{t.status}</TableHead>
                <TableHead className="text-right">{t.totalPlanned}</TableHead>
                <TableHead className="text-right">{t.totalPicked}</TableHead>
                <TableHead className="text-right">{t.totalDiff}</TableHead>
                <TableHead>{t.createdAt}</TableHead>
                <TableHead>{t.createdBy}</TableHead>
                <TableHead className="w-[100px] text-right">{t.actions}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredIssues.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={13} className="py-6 text-center text-sm text-muted-foreground">
                    {t.noResults}
                  </TableCell>
                </TableRow>
              ) : (
                filteredIssues.map(issue => {
                  const totals = calculateTotals(issue)
                  return (
                    <TableRow key={issue.issue_no} className="hover:bg-muted/40">
                      <TableCell className="font-medium">{issue.issue_no}</TableCell>
                      <TableCell>{issue.issue_type}</TableCell>
                      <TableCell>{issue.partner_name || '-'}</TableCell>
                      <TableCell>{issue.from_wh_name}</TableCell>
                      <TableCell>{issue.to_wh_name || '-'}</TableCell>
                      <TableCell>{formatDate(issue.expected_date)}</TableCell>
                      <TableCell>
                        <Badge className={statusColors[issue.status]}>{issue.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{totals.planned.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{totals.picked.toLocaleString()}</TableCell>
                      <TableCell className="text-right">{(totals.picked - totals.planned).toLocaleString()}</TableCell>
                      <TableCell>{formatDate(issue.created_at, true)}</TableCell>
                      <TableCell>{issue.created_by}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => openPicking(issue)}>
                              <ClipboardList className="mr-2 h-4 w-4" />
                              {t.manageWorkflow}
                            </DropdownMenuItem>
                            {issue.status === 'Draft' && (
                              <DropdownMenuItem onClick={() => openEditDraft(issue)}>
                                <Edit className="mr-2 h-4 w-4" />
                                {t.editDraft}
                              </DropdownMenuItem>
                            )}
                            {issue.status === 'Draft' && (
                              <DropdownMenuItem onClick={() => handleStartPicking(issue)}>
                                <ClipboardList className="mr-2 h-4 w-4" />
                                {t.startPicking}
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  )
                })
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter>
          <p className="text-sm text-muted-foreground">
            {t.summaryTotals(overallTotals.planned, overallTotals.picked, overallTotals.diff)}
          </p>
        </CardFooter>
      </Card>
      <GoodsIssueDraftForm open={showDraftForm} onClose={() => setShowDraftForm(false)} issue={draftToEdit} />
      <GoodsIssuePickingPanel issueNo={activeIssueNo} open={Boolean(activeIssueNo)} onClose={() => setActiveIssueNo(undefined)} />
    </div>
  )
}
